import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import apiRoutes from './src/api/routes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { processSyncPayload } from './src/db/sync.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('push-update', async (data) => {
      try {
        await processSyncPayload(data);
        socket.broadcast.emit('pull-update', data);
      } catch (err) {
        console.error('Socket Sync Error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  app.use(express.json());

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use('/api', apiRoutes);

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
