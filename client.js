import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import dotenv from 'dotenv';
dotenv.config();

async function runClient(sse = false) {

    if (sse) {
        // 1. Initialize SSE Transport
        // Point this to your server's GET /sse endpoint
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdyZWdnYmxhemVyQGdtYWlsLmNvbSIsInVpZCI6IjY2Y2VkNDJiOTVjYWZiZmNlMzhkODAwMyIsImlhdCI6MTc2MjIzNzQ3M30.wEWLm-o7I0WGl70OgCc4_6cwdI4pe6otThyisoGQATA';
        const transport = new SSEClientTransport(new URL("http://localhost:4000/sse"), {
            // Optional: Add headers if your server requires auth
            requestInit: {
                headers: {
                    // This is where you put your Bearer Token
                    "Authorization": `Bearer ${token}`,
                    // You can add other custom headers if your server requires them
                    "Content-Type": "application/json",
                }
            }
        });

        // 2. Initialize the MCP Client
        const client = new Client({
            name: "my-sse-client",
            version: "1.0.0"
        }, {
            capabilities: {}
        });

        try {
            // 3. Connect
            // This establishes the GET stream. The server will send back
            // a 'endpoint' event telling the client where to POST messages.
            await client.connect(transport);
            console.log("Connected to SSE Server!");

            // 4. Use the server tools
            const tools = await client.listTools();
            console.log("Available Tools:", tools.tools.length);

        } catch (error) {
            console.error("SSE Connection Error:", error);
        } finally {
            // 5. Cleanup
            await client.close();
        }
    } else {

        // 1. Initialize the Transport with the server's public URL
        // Public MCP 
        // const transport = new StreamableHTTPClientTransport(new URL("https://knowledge-mcp.global.api.aws"), {});
        // const transport = new StreamableHTTPClientTransport(new URL("https://api.githubcopilot.com/mcp/"), {});
        // const transport = new StreamableHTTPClientTransport(new URL("http://107.21.194.22:4000/mcp"), {});
        // const transport = new StreamableHTTPClientTransport(new URL("http://localhost:4000/mcp"), {});
        // const transport = new StreamableHTTPClientTransport(new URL("https://backend.vavicky.com/mcp")
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdyZWdnYmxhemVyQGdtYWlsLmNvbSIsInVpZCI6IjY2Y2VkNDJiOTVjYWZiZmNlMzhkODAwMyIsImlhdCI6MTc2MjIzNzQ3M30.wEWLm-o7I0WGl70OgCc4_6cwdI4pe6otThyisoGQATA';
        const transport = new StreamableHTTPClientTransport(new URL("http://localhost:4000/mcp"), {
            requestInit: {
                headers: {
                    // This is where you put your Bearer Token
                    "Authorization": `Bearer ${token}`,
                    // You can add other custom headers if your server requires them
                    "Content-Type": "application/json",
                }
            }
        });

        // 2. Initialize the MCP Client acts like Claude Desktop 
        const client = new Client({
            name: "my-node-client",
            version: "1.0.0"
        }, {
            capabilities: {}
        });

        try {
            // 3. Establish connection
            await client.connect(transport);
            console.log("Connected to MCP Server!");

            // 4. List available tools
            const tools = await client.listTools();
            console.log("Available Tools:", tools.tools.length);

            // 5. Call a tool
            const result = await client.callTool({
                name: "get_assistant",
                arguments: {
                    assistant_id: "67f2c14bef66024535de9e25"
                }
            });

            console.log("Tool Result:", result);

        } catch (error) {
            console.error("Connection failed:", error);
        } finally {
            // 6. Gracefully close the connection
            await client.close();
        }
    }

}

runClient(false);