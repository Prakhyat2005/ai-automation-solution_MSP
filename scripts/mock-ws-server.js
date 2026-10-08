const WebSocket = require('ws');

const DEFAULT_PORT = 8080;
const PORT = Number(process.env.WS_PORT || process.env.PORT || DEFAULT_PORT);
const PATH = process.env.WS_PATH || '/ws';

const wss = new WebSocket.Server({ port: PORT, path: PATH });

wss.on('connection', (ws) => {
  console.log('WS client connected');

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data?.type === 'heartbeat') {
        // Optionally acknowledge heartbeat
        // No-op: client doesn't require ack
      }
    } catch {
      // Non-JSON payloads ignored
    }
  });

  const interval = setInterval(() => {
    const payload = {
      id: Date.now().toString(),
      title: 'Mock Notification',
      message: 'Hello from mock server',
      type: 'info',
      timestamp: Date.now(),
      read: false,
    };

    ws.send(JSON.stringify({ type: 'notification', payload, timestamp: Date.now() }));
  }, 10000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

console.log(`Mock WS listening on ws://localhost:${PORT}${PATH}`);