import { Response } from 'express';
import { Task, ITask } from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import { sortTasksByMixAlgorithm, calculateTaskMixScore } from '../utils/mixSorter';

/**
 * Get all tasks for authenticated user with optional filter & sort
 * GET /api/tasks?status=all|pending|completed|today&category=...&priority=...&search=...&sortBy=mix|deadline|priority|date
 */
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { status, category, priority, search, sortBy = 'mix' } = req.query;

    const query: any = { user: userId };

    // Status filter
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'pending') {
      query.isCompleted = false;
    } else if (status === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      query.dateTime = { $gte: startOfDay, $lte: endOfDay };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search filter
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { tags: searchRegex }];
    }

    let tasks = await Task.find(query);

    // Apply Sorting
    if (sortBy === 'mix') {
      tasks = sortTasksByMixAlgorithm(tasks);
    } else if (sortBy === 'deadline') {
      tasks.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (sortBy === 'date') {
      tasks.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }

    // Attach mixScore property to each task for UI insight
    const formattedTasks = tasks.map((t) => {
      const obj = t.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
        mixScore: calculateTaskMixScore(t),
      };
    });

    res.status(200).json({
      count: formattedTasks.length,
      tasks: formattedTasks,
    });
  } catch (error: any) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
};

/**
 * Create a new task
 * POST /api/tasks
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, description, dateTime, deadline, priority, category, tags } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Task title is required' });
      return;
    }

    const newTask = await Task.create({
      user: userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      dateTime: dateTime ? new Date(dateTime) : new Date(),
      deadline: deadline ? new Date(deadline) : undefined,
      priority: priority || 'medium',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
      isCompleted: false,
    });

    const obj = newTask.toObject();
    res.status(201).json({
      message: 'Task created successfully',
      task: {
        ...obj,
        id: obj._id.toString(),
        mixScore: calculateTaskMixScore(newTask),
      },
    });
  } catch (error: any) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

/**
 * Update an existing task
 * PUT /api/tasks/:id
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    const { title, description, dateTime, deadline, priority, category, tags, isCompleted } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dateTime !== undefined) task.dateTime = new Date(dateTime);
    if (deadline !== undefined) task.deadline = deadline ? new Date(deadline) : undefined;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (tags !== undefined) task.tags = Array.isArray(tags) ? tags : [];

    if (isCompleted !== undefined) {
      task.isCompleted = isCompleted;
      task.completedAt = isCompleted ? new Date() : undefined;
    }

    await task.save();

    const obj = task.toObject();
    res.status(200).json({
      message: 'Task updated successfully',
      task: {
        ...obj,
        id: obj._id.toString(),
        mixScore: calculateTaskMixScore(task),
      },
    });
  } catch (error: any) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

/**
 * Toggle task completed status
 * PATCH /api/tasks/:id/toggle
 */
export const toggleTaskCompletion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : undefined;

    await task.save();

    const obj = task.toObject();
    res.status(200).json({
      message: `Task marked as ${task.isCompleted ? 'completed' : 'pending'}`,
      task: {
        ...obj,
        id: obj._id.toString(),
        mixScore: calculateTaskMixScore(task),
      },
    });
  } catch (error: any) {
    console.error('Error in toggleTaskCompletion:', error);
    res.status(500).json({ message: 'Server error toggling task completion', error: error.message });
  }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await Task.deleteOne({ _id: id, user: userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Task not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Server error deleting task', error: error.message });
  }
};

/**
 * Get analytics and stats overview
 * GET /api/tasks/stats
 */
export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, isCompleted: true });
    const pendingTasks = await Task.countDocuments({ user: userId, isCompleted: false });
    const urgentTasks = await Task.countDocuments({ user: userId, isCompleted: false, priority: 'urgent' });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      urgent: urgentTasks,
      completionRate,
    });
  } catch (error: any) {
    console.error('Error in getTaskStats:', error);
    res.status(500).json({ message: 'Server error fetching task stats', error: error.message });
  }
};
