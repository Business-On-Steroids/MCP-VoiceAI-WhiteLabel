import express from "express";
import cors from "cors";
// import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as Users from './tools/users.js';
import * as Twilio from './tools/assistants.js';
import * as Assistant from './tools/twilio.js';



const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize your MCP Server
const server = new McpServer({
  name: "VA Vicky Public MCP Server",
  title: "VA Vicky  Public MCP Server",
  description: "VA Vicky  Public MCP Server",
  websiteUrl: "https://vavicky.com",
  version: "1.0.0"
});

// 2. Define tools
const tools = [
  ...Users.getTools(),
  ...Assistant.getTools(),
  ...Twilio.getTools()
]
for (const t of tools) server.registerTool(t.name, t.config, t.callback)

// 3. Store active transports/sessions
const transports = new Map();

// 4. Single MCP Endpoint
app.all("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];

  // Handle New Session / Message
  if (req.method === "POST") {
    let transport = transports.get(sessionId);

    if (!transport) {
      // Create new transport for new session
      transport = new StreamableHTTPServerTransport();
      await server.connect(transport);

      const newSessionId = transport.sessionId; // SDK generates this
      transports.set(newSessionId, transport);

      // Clean up on close
      res.on("close", () => {
        transport.close();
        transports.delete(newSessionId);
      });
    }
    // console.log(req.body);
    /*

4|mcp  |   method: 'initialize',
4|mcp  |   params: {
4|mcp  |     protocolVersion: '2025-03-26',
4|mcp  |     capabilities: {},
4|mcp  |     clientInfo: { name: 'mcp', version: '0.1.0' }
4|mcp  |   },
4|mcp  |   jsonrpc: '2.0',
4|mcp  |   id: 0
4|mcp  | }
4|mcp  | { method: 'notifications/initialized', jsonrpc: '2.0' }
4|mcp  | { method: 'tools/list', jsonrpc: '2.0', id: 1 }
4|mcp  | {
4|mcp  |   method: 'initialize',
4|mcp  |   params: {
4|mcp  |     protocolVersion: '2025-03-26',
4|mcp  |     capabilities: {},
4|mcp  |     clientInfo: { name: 'mcp', version: '0.1.0' }
4|mcp  |   },
4|mcp  |   jsonrpc: '2.0',
4|mcp  |   id: 0
4|mcp  | }
4|mcp  | { method: 'notifications/initialized', jsonrpc: '2.0' }
4|mcp  | { method: 'tools/list', jsonrpc: '2.0', id: 1 }
4|mcp  | {
4|mcp  |   method: 'initialize',
4|mcp  |   params: {
4|mcp  |     protocolVersion: '2025-03-26',
4|mcp  |     capabilities: {},
4|mcp  |     clientInfo: { name: 'mcp', version: '0.1.0' }
4|mcp  |   },
4|mcp  |   jsonrpc: '2.0',
4|mcp  |   id: 0
4|mcp  | }
4|mcp  | { method: 'notifications/initialized', jsonrpc: '2.0' }
4|mcp  | { method: 'tools/list', jsonrpc: '2.0', id: 1 }
4|mcp  | {
4|mcp  |   method: 'initialize',
4|mcp  |   params: {
4|mcp  |     protocolVersion: '2025-03-26',
4|mcp  |     capabilities: {},
4|mcp  |     clientInfo: { name: 'mcp', version: '0.1.0' }
4|mcp  |   },
4|mcp  |   jsonrpc: '2.0',
4|mcp  |   id: 0
4|mcp  | }
4|mcp  | { method: 'notifications/initialized', jsonrpc: '2.0' }
4|mcp  | { method: 'tools/list', jsonrpc: '2.0', id: 1 }
4|mcp  | {
4|mcp  |   method: 'initialize',
4|mcp  |   params: {
4|mcp  |     protocolVersion: '2025-03-26',
4|mcp  |     capabilities: {},
4|mcp  |     clientInfo: { name: 'mcp', version: '0.1.0' }
4|mcp  |   },
4|mcp  |   jsonrpc: '2.0',
4|mcp  |   id: 0
4|mcp  | }
4|mcp  | { method: 'notifications/initialized', jsonrpc: '2.0' }
4|mcp  | { method: 'tools/list', jsonrpc: '2.0', id: 1 }
4|mcp  | {
4|mcp  |   method: 'initialize',
4|mcp  |   params: {
4|mcp  |     protocolVersion: '2025-03-26',
4|mcp  |     capabilities: {},
4|mcp  |     clientInfo: { name: 'mcp', version: '0.1.0' }
4|mcp  |   },
4|mcp  |   jsonrpc: '2.0',
4|mcp  |   id: 0
4|mcp  | }
    */
    await transport.handleRequest(req, res, req.body);
  }

  // Handle Session Termination
  else if (req.method === "DELETE" && sessionId) {
    const transport = transports.get(sessionId);
    if (transport) {
      await transport.close();
      transports.delete(sessionId);
      res.status(200).end();
    }
  }
});

app.listen(4000, () => console.log("MCP Server running at http://localhost:4000/mcp"));