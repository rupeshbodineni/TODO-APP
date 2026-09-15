import mongoose, { Document, Schema } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dateTime: Date;
  deadline?: Date;
  priority: TaskPriority;
  category: string;
  tags: string[];
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast querying by user and completion status
TaskSchema.index({ user: 1, isCompleted: 1 });
TaskSchema.index({ user: 1, category: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
