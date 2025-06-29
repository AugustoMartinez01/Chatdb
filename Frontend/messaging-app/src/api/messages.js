// src/api/messages.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchMessages = async () => {
  const res = await axios.get(`${API_URL}/api/messages`);
  return res.data;
};

export const sendMessage = async (data) => {
  const res = await axios.post(`${API_URL}/api/messages`, data);
  return res.data;
};
