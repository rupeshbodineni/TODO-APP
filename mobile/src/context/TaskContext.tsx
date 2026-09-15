import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import apiClient from '../api/client';
import { Task, TaskStats, FilterOptions, SortMode, FilterStatus } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: FilterOptions;
  fetchTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addTask: (data: Partial<Task>) => Promise<boolean>;
  updateTask: (id: string, data: Partial<Task>) => Promise<boolean>;
  toggleTask: (id: string) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  setFilterOptions: (newFilters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  status: 'all',
  category: 'All',
  priority: 'All',
  search: '',
  sortBy: 'mix', // Smart Mix Algorithm by default!
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const fetchTasks = useCallback(async () => {
    if (!token || !user) return;
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, string> = {
        status: filters.status,
        category: filters.category,
        priority: filters.priority,
        search: filters.search,
        sortBy: filters.sortBy,
      };

      const response = await apiClient.get('/tasks', { params });
      setTasks(response.data?.tasks || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError('Could not connect to backend server. Make sure API server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [token, user, filters]);

  const refreshTasks = async () => {
    setIsRefreshing(true);
    await fetchTasks();
    await fetchStats();
    setIsRefreshing(false);
  };

  const fetchStats = useCallback(async () => {
    if (!token || !user) return;
    try {
      const response = await apiClient.get('/tasks/stats');
      setStats(response.data);
    } catch (err) {
      console.warn('Could not fetch task stats');
    }
  }, [token, user]);

  useEffect(() => {
    if (user && token) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
      setStats(null);
    }
  }, [user, token, fetchTasks, fetchStats]);

  const addTask = async (data: Partial<Task>): Promise<boolean> => {
    try {
      const response = await apiClient.post('/tasks', data);
      if (response.data?.task) {
        await refreshTasks();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add task');
      return false;
    }
  };

  const updateTask = async (id: string, data: Partial<Task>): Promise<boolean> => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, data);
      if (response.data?.task) {
        await refreshTasks();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  const toggleTask = async (id: string): Promise<boolean> => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );

    try {
      await apiClient.patch(`/tasks/${id}/toggle`);
      await fetchStats();
      return true;
    } catch (err) {
      // Revert optimism if failed
      await fetchTasks();
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await apiClient.delete(`/tasks/${id}`);
      await fetchStats();
      return true;
    } catch (err) {
      await fetchTasks();
      return false;
    }
  };

  const setFilterOptions = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        isLoading,
        isRefreshing,
        error,
        filters,
        fetchTasks,
        refreshTasks,
        fetchStats,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        setFilterOptions,
        resetFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
