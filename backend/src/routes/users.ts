import { Router } from 'express';
import { seedUsers } from '../data/seedData.js';
import { User } from '../types/index.js';

export const usersRouter = Router();
let users: User[] = [...seedUsers];

usersRouter.get('/', (_req, res) => {
  res.json(users);
});

usersRouter.post('/', (req, res) => {
  const newUser: User = {
    ...req.body,
    id: req.body.id || String(Date.now()),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

usersRouter.patch('/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
});
