// wrapper.js
import fs from 'fs';
import https from 'https';
import express from 'express';
import dotenv from 'dotenv';
import { VavickyMCPServer } from './index.js'; // Make sure index.js exports your MCP class

dotenv.config();

const app = express();
const port = process.env.PORT || 443;

// Load SSL certs
const key = fs.readFileSync('./certs/key.pem');
const cert = fs.readFileSync('./certs/cert.pem');

app.use(express.json());

// Init MCP server logic
const vavicky = new VavickyMCPServer();

// Health check
app.get('/', (req, res) => {
  res.send('✅ Vavicky MCP HTTPS server is running');
});

// Tool execution endpoint
app.post('/call-tool', async (req, res) => {
  const { toolName, args } = req.body;

  if (!toolName || typeof args !== 'object') {
    return res.status(400).json({ error: 'toolName and args are required' });
  }

  try {
    const result = await vavicky.executeTool(toolName, args);
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create HTTPS server
https.createServer({ key, cert }, app).listen(port, () => {
  console.log(`🔒 Vavicky MCP HTTPS server running on port ${port}`);
});
