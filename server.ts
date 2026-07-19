/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Server-side API Proxy for fetching Garena Free Fire player info
  app.get('/api/info', async (req, res) => {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    try {
      const targetUrl = `https://nirob-x-info.vercel.app/info?uid=${uid}`;
      const apiRes = await fetch(targetUrl);
      const text = await apiRes.text();

      if (!apiRes.ok) {
        return res.status(apiRes.status).json({
          error: `Target API returned status ${apiRes.status}`,
          raw: text.substring(0, 200)
        });
      }

      try {
        const data = JSON.parse(text);
        res.json(data);
      } catch (jsonErr) {
        return res.status(502).json({
          error: 'Target API returned invalid JSON format',
          raw: text.substring(0, 200)
        });
      }
    } catch (err: any) {
      console.error(`[Server API Error] /api/info for UID ${uid}:`, err.message);
      res.status(502).json({ error: 'Failed to fetch player stats from remote gateway', message: err.message });
    }
  });

  // Server-side API Proxy for the Like Injector
  app.get('/api/like', async (req, res) => {
    const { uid, server_name } = req.query;
    if (!uid || !server_name) {
      return res.status(400).json({ error: 'UID and server_name are required' });
    }

    try {
      const targetUrl = `https://ayan-like-ob54.vercel.app/like?uid=${uid}&server_name=${server_name}&key=JMLB`;
      const apiRes = await fetch(targetUrl);
      if (!apiRes.ok) {
        throw new Error(`Target Like API returned status: ${apiRes.status}`);
      }
      const data = await apiRes.json();
      res.json(data);
    } catch (err: any) {
      console.error(`[Server API Error] /api/like for UID ${uid}:`, err.message);
      res.status(502).json({ error: 'Failed to process reputation injection from remote server' });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FF VIP Hub] Server running on port ${PORT}`);
  });
}

startServer();
