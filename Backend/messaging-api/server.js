import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import './config/db.js';
import messageRoutes from './routes/message-routes.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/api/messages', messageRoutes);

// 🧼 Endpoint para reiniciar el chat (eliminar todos los mensajes)
app.delete('/api/messages', async (req, res) => {
  try {
    await Message.deleteMany({});
    io.emit('receiveMessageHistory', []); // Limpiar en todos los clientes
    res.status(200).json({ msg: 'Chat reiniciado con éxito' });
  } catch (err) {
    console.error('Error al borrar mensajes:', err);
    res.status(500).json({ error: 'Error al reiniciar el chat' });
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado por WebSocket');

  socket.on('getMessages', async () => {
    try {
      const messages = await Message.find().sort({ timestamp: 1 });
      socket.emit('receiveMessageHistory', messages);
    } catch (err) {
      console.error('⚠️ Error al obtener historial:', err);
    }
  });

  socket.on('sendMessage', async (msg) => {
    try {
      const newMessage = await Message.create({
        ...msg,
        timestamp: Date.now(),
      });
      io.emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('⚠️ Error al guardar mensaje:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
