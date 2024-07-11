// socket.js
import { Server } from 'socket.io';
import { connection as pool } from './Database Create Queries/database.js'; // Adjust the path as needed

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Frontend URL
    },
  });

  io.on('connection', (socket) => {

    socket.on('request_messages', async () => {
      try {
        const [results] = await pool.query('SELECT * FROM messages');
        socket.emit('load_messages', results);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('send_message', async (data) => {
      const { author, message, time } = data;
      try {
        await pool.query(
          'INSERT INTO messages (author, message, time) VALUES (?, ?, ?)',
          [author, message, time]
        );
        io.emit('receive_message', data);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('delete_message', async (id) => {
      try {
        await pool.query('DELETE FROM messages WHERE id = ?', [id]);
        io.emit('message_deleted', id);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
    });
  });
};
