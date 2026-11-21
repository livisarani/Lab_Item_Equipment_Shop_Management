import { Router } from 'express';

export const messagesRouter = Router();

let conversations = [
  {
    id: '1',
    userId: '3',
    user: 'Dr. Aris Thorne (Customer)',
    role: 'customer',
    subject: 'Corrosive containment inquiry for ORD-2026-001',
    lastMessage: 'When will my Sulfuric Acid order arrive? Please ensure hazmat bin is used.',
    time: '10 mins ago',
    unread: true,
    messages: [
      {
        id: 'm1',
        sender: 'Dr. Aris Thorne (Customer)',
        text: 'Hello, I placed order ORD-2026-001 for 2L Sulfuric Acid and 1kg NaOH.',
        time: '10:30 AM',
        isOwn: false
      },
      {
        id: 'm2',
        sender: 'Marcus Sterling (Manager)',
        text: 'Yes Dr. Thorne, we verified your Biosafety Level-2 clearance. It is scheduled for hazmat dispatch.',
        time: '10:32 AM',
        isOwn: true
      },
      {
        id: 'm3',
        sender: 'Dr. Aris Thorne (Customer)',
        text: 'When will my Sulfuric Acid order arrive? Please ensure hazmat bin is used.',
        time: '10:35 AM',
        isOwn: false
      }
    ]
  }
];

messagesRouter.get('/', (_req, res) => {
  res.json(conversations);
});

messagesRouter.post('/:id/reply', (req, res) => {
  const conv = conversations.find((c) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ message: 'Conversation not found' });
  const msg = {
    id: String(Date.now()),
    sender: req.body.sender || 'Marcus Sterling (Manager)',
    text: req.body.text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isOwn: true
  };
  conv.messages.push(msg);
  conv.lastMessage = req.body.text;
  conv.unread = false;
  res.status(201).json(conv);
});
