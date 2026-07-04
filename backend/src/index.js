const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Bebe AI Real Backend API' }));
app.get('/api/info', (req, res) => res.json({ service: 'Backend API', version: '1.0.0', status: 'running', port: PORT }));
app.get('/api/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() }));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('connected', { message: 'Connected to Bebe AI Real' });
  socket.on('message', (data) => io.emit('broadcast', { from: socket.id, message: data, timestamp: new Date() }));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: 'Internal Server Error' }); });
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

server.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
module.exports = { app, server, io };
