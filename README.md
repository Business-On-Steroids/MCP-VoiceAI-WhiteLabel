# How to update AWS MCP server

## Update the MCP Server
This command will update the code on AWS and restart the MCP Server and it opens the logs.
```
cd MCP-VoiceAI-WhiteLabel/ && git pull && pm2 restart 4 && pm2 logs 4
```

# Exit the logs
```
Press CTRL+C
```


# Vavicky MCP Server

Complete MCP server implementation for the VoiceAI VAVicky AiAgency platform.

## Features

### User Management
- Get user data including tokens and settings
- Update White Label details (name, description, domain, color)
- Update SMTP settings for custom email notifications

### API Token Management
- Update OpenAI API Key
- Update ElevenLabs API Key
- Update Deepseek API Key
- Update Google Gemini API Key
- Update Open Router API Key

### Assistant Management
- Get all assistants
- Get specific assistant information
- Create new assistants with comprehensive configuration
- Update existing assistants
- Delete assistants
- Manage assistant files
- Get usage statistics and analytics
- Chat with assistants

### Twilio Integration
- Connect/disconnect Twilio accounts
- Get available phone numbers
- Purchase phone numbers
- Manage existing numbers
- Get usage statistics

### Communication
- Make individual phone calls
- Make bulk phone calls
- Send SMS messages
- Cancel active calls
- Monitor calls in progress

## Installation

1. **Clone or create the project**:
   ```bash
   mkdir vavicky-mcp-server
   cd vavicky-mcp-server
   ```

2. **Create package.json**:
   ```bash
   npm init -y
   npm install @modelcontextprotocol/sdk node-fetch
   ```

3. **Create the server.js file** with the provided code

4. **Set up environment variables**:
   ```bash
   echo 'VAVICKY_API_KEY=your-api-key-here' > .env
   ```

5. **Make the server executable**:
   ```bash
   chmod +x server.js
   ```

## Claude Desktop Configuration

Add this to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "vavicky": {
      "command": "node",
      "args": ["/absolute/path/to/your/vavicky-mcp-server/server.js"],
      "env": {
        "VAVICKY_API_KEY": "your-vavicky-api-key-here"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can use these tools in Claude:

### Assistant Management
```
Claude, create a new voice assistant named 'Sales Bot' with OpenAI GPT-4 that can make phone calls and has a professional greeting.
```

### Communication
```
Claude, send an SMS to +1234567890 using assistant ID 'assist_123' with the message 'Hello, this is a test message.'
```

### Analytics
```
Claude, show me the usage statistics for all my assistants this month.
```

### Phone Management
```
Claude, get me a list of available toll-free numbers in the US and purchase one for my business.
```

## Tool Reference

### User Management Tools
- `get_user` - Get user data including tokens and settings
- `update_white_label` - Update White Label branding
- `update_smtp` - Configure email settings

### Token Management Tools
- `update_openai_token` - Set OpenAI API key
- `update_elevenlabs_token` - Set ElevenLabs API key
- `update_deepseek_token` - Set Deepseek API key
- `update_gemini_token` - Set Gemini API key
- `update_openrouter_token` - Set Open Router API key

### Assistant Tools
- `get_assistants` - List all assistants
- `get_assistant` - Get basic assistant info
- `get_one_assistant` - Get complete assistant info
- `create_assistant` - Create new assistant
- `update_assistant` - Update assistant settings
- `delete_assistant` - Remove assistant
- `get_assistant_files` - List assistant files
- `delete_assistant_file` - Remove assistant file
- `get_assistant_usage` - Get usage stats
- `get_assistants_token_usage` - Get token usage across assistants
- `get_dashboard_assistant` - Get dashboard assistant
- `chat_with_assistant` - Chat with assistant

### Twilio Tools
- `connect_twilio` - Connect Twilio account
- `disconnect_twilio` - Disconnect Twilio
- `get_twilio_numbers` - List phone numbers
- `get_available_numbers` - Find available numbers
- `buy_twilio_number` - Purchase phone number
- `update_twilio_number` - Configure number settings
- `get_twilio_usage` - Get Twilio usage stats

### Communication Tools
- `make_call` - Make phone call
- `make_bulk_call` - Make bulk calls
- `get_calls_in_progress` - List active calls
- `cancel_call` - Cancel active call
- `send_sms` - Send SMS message

## Error Handling

The server includes comprehensive error handling:
- API authentication errors
- Invalid parameters
- Network connectivity issues
- API rate limiting

## Development

To run in development mode with debugging:
```bash
npm run dev
```

## Security

- API keys are passed via environment variables
- All requests include proper authentication headers
- Input validation is performed on all parameters

## Support

For issues with the Vavicky platform, visit: https://github.com/Business-On-Steroids/n8n-nodes-voiceai
For MCP-related issues, refer to the Anthropic MCP documentation.

## License

This MCP server follows the same licensing as the original Vavicky n8n node implementation.


