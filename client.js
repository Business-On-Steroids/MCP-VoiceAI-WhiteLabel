import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function runClient() {
    // 1. Initialize the Transport with the server's public URL
    // Public MCP 
    // const transport = new StreamableHTTPClientTransport("https://knowledge-mcp.global.api.aws", {});
    // const transport = new StreamableHTTPClientTransport("https://api.githubcopilot.com/mcp/", {});
    // const transport = new StreamableHTTPClientTransport("http://107.21.194.22:4000/mcp", {});
    const transport = new StreamableHTTPClientTransport("https://backend.vavicky.com/mcp", {

        // THIS is where you put the CREDENTIALS Bearer Token and all

    });
    
    // 2. Initialize the MCP Client
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
            name: "get_user",
            arguments: { name: "World" }
        });

        console.log("Tool Result:", result);

    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        // 6. Gracefully close the connection
        await client.close();
    }
}

runClient();