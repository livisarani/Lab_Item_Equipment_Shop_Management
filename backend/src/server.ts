import express from 'express';
import cors from 'cors';
import { itemsRouter } from './routes/items.js';
import { ordersRouter } from './routes/orders.js';
import { usersRouter } from './routes/users.js';
import { systemRouter } from './routes/system.js';
import { messagesRouter } from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'LISM Backend API', timestamp: new Date().toISOString() });
});

app.use('/api/items', itemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/system', systemRouter);
app.use('/api/messages', messagesRouter);

app.listen(PORT, () => {
  console.log(`LISM Backend API Server running at http://localhost:${PORT}`);
});
