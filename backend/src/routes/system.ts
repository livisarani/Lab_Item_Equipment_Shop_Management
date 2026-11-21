import { Router } from 'express';
import { seedAuditLogs, seedConfig } from '../data/seedData.js';

export const systemRouter = Router();
let config = { ...seedConfig };
let auditLogs = [...seedAuditLogs];

systemRouter.get('/config', (_req, res) => {
  res.json(config);
});

systemRouter.put('/config', (req, res) => {
  config = { ...config, ...req.body };
  res.json(config);
});

systemRouter.get('/audit-logs', (_req, res) => {
  res.json(auditLogs);
});

systemRouter.post('/audit-logs', (req, res) => {
  const newLog = {
    ...req.body,
    id: String(Date.now()),
    timestamp: new Date().toISOString()
  };
  auditLogs.unshift(newLog);
  res.status(201).json(newLog);
});
