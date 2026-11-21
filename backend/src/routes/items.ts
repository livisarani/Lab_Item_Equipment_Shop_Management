import { Router } from 'express';
import { seedItems } from '../data/seedData.js';
import { Item } from '../types/index.js';

export const itemsRouter = Router();
let items: Item[] = [...seedItems];

itemsRouter.get('/', (_req, res) => {
  res.json(items);
});

itemsRouter.get('/:id', (req, res) => {
  const item = items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

itemsRouter.post('/', (req, res) => {
  const newItem: Item = {
    ...req.body,
    id: req.body.id || String(Date.now())
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

itemsRouter.put('/:id', (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

itemsRouter.delete('/:id', (req, res) => {
  items = items.filter((i) => i.id !== req.params.id);
  res.status(204).send();
});
