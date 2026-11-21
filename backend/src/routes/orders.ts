import { Router } from 'express';
import { seedOrders } from '../data/seedData.js';
import { Order } from '../types/index.js';

export const ordersRouter = Router();
let orders: Order[] = [...seedOrders];

ordersRouter.get('/', (_req, res) => {
  res.json(orders);
});

ordersRouter.post('/', (req, res) => {
  const newOrder: Order = {
    ...req.body,
    id: req.body.id || `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

ordersRouter.patch('/:id', (req, res) => {
  const idx = orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });
  orders[idx] = {
    ...orders[idx],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(orders[idx]);
});
