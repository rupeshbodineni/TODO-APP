import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Protect all task endpoints with JWT middleware
router.use(authenticateJWT);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getTaskStats);
router.put('/:id', updateTask);
router.patch('/:id/toggle', toggleTaskCompletion);
router.delete('/:id', deleteTask);

export default router;
