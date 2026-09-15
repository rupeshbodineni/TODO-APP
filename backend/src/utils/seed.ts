import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Task } from '../models/Task';

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp';
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create Test User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const testUser = await User.create({
      name: 'Rupesh',
      email: 'rupesh@example.com',
      password: hashedPassword,
    });

    console.log(`Created test user: ${testUser.email} / password123`);

    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Create Sample Tasks
    await Task.create([
      {
        user: testUser._id,
        title: 'Complete React Native Mobile Assignment',
        description: 'Build user auth, MongoDB API, TypeScript, and smart mix algorithm sorting.',
        dateTime: now,
        deadline: in2Hours,
        priority: 'urgent',
        category: 'Study',
        tags: ['React Native', 'TypeScript', 'Assignment'],
        isCompleted: false,
      },
      {
        user: testUser._id,
        title: 'Submit Code Repository & Documentation',
        description: 'Ensure clean architecture and comprehensive comments.',
        dateTime: now,
        deadline: in12Hours,
        priority: 'high',
        category: 'Work',
        tags: ['Git', 'Backend'],
        isCompleted: false,
      },
      {
        user: testUser._id,
        title: 'Morning Gym & Cardio Workout',
        description: '30 mins treadmill + weight training session.',
        dateTime: now,
        deadline: in2Days,
        priority: 'medium',
        category: 'Fitness',
        tags: ['Health'],
        isCompleted: false,
      },
      {
        user: testUser._id,
        title: 'Weekly Grocery Shopping',
        description: 'Buy fresh fruits, vegetables, and protein shake mix.',
        dateTime: now,
        priority: 'low',
        category: 'Shopping',
        tags: ['Home'],
        isCompleted: true,
        completedAt: now,
      },
    ]);

    console.log('✅ Seed completed successfully with 4 sample tasks!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
