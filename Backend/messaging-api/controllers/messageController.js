import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
};

export const createMessage = async (req, res) => {
  const newMsg = await Message.create(req.body);
  res.status(201).json(newMsg);
};
