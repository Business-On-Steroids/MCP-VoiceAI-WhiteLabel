#!/usr/bin/env node

/**
 * Vavicky MCP Server
 * Complete MCP implementation for VoiceAI VAVicky AiAgency platform
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

class VavickyMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'vavicky-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.apiKey = process.env.VAVICKY_API_KEY;
    this.baseUrl = 'https://backend.vavicky.com/vavicky/api'; 
    this.setupToolHandlers();
  }
 setupToolHandlers() {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // User Management
          {
            name: 'get_user',
            description: 'Get user data including tokens and settings',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'update_white_label',
            description: 'Update White Label details: name, description, domain and color',
            inputSchema: {
              type: 'object',
              properties: {
                whitelabel_name: { type: 'string', description: 'White label name' },
                whitelabel_description: { type: 'string', description: 'White label description' },
                whitelabel_domain: { type: 'string', description: 'White label domain' },
                whitelabel_color: { type: 'string', description: 'White label color (hex code)' }
              },
              required: []
            }
          },
          {
            name: 'update_smtp',
            description: 'Update SMTP settings for custom email notifications',
            inputSchema: {
              type: 'object',
              properties: {
                smtp_email: { type: 'string', description: 'SMTP email address' },
                smtp_password: { type: 'string', description: 'SMTP password' },
                smtp_host: { type: 'string', description: 'SMTP host' },
                smtp_port: { type: 'string', description: 'SMTP port' }
              },
              required: ['smtp_email', 'smtp_password', 'smtp_host']
            }
          },
          // API Token Management
          {
            name: 'update_openai_token',
            description: 'Update OpenAI API Key',
            inputSchema: {
              type: 'object',
              properties: {
                openai_token: { type: 'string', description: 'OpenAI API Key' }
              },
              required: ['openai_token']
            }
          },
          {
            name: 'update_elevenlabs_token',
            description: 'Update Elevenlabs API Key',
            inputSchema: {
              type: 'object',
              properties: {
                elevenlabs_token: { type: 'string', description: 'Elevenlabs API Key' }
              },
              required: ['elevenlabs_token']
            }
          },
          {
            name: 'update_deepseek_token',
            description: 'Update Deepseek API Key',
            inputSchema: {
              type: 'object',
              properties: {
                deepseek_token: { type: 'string', description: 'Deepseek API Key' }
              },
              required: ['deepseek_token']
            }
          },
          {
            name: 'update_gemini_token',
            description: 'Update Google Gemini API Key',
            inputSchema: {
              type: 'object',
              properties: {
                gemini_token: { type: 'string', description: 'Google Gemini API Key' }
              },
              required: ['gemini_token']
            }
          },
          {
            name: 'update_openrouter_token',
            description: 'Update Open Router API Key',
            inputSchema: {
              type: 'object',
              properties: {
                openrouter_token: { type: 'string', description: 'Open Router API Key' }
              },
              required: ['openrouter_token']
            }
          },
          // Assistant Management
          {
            name: 'get_assistants',
            description: 'Get all assistants for the authenticated user',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'get_assistant',
            description: 'Get basic information about a specific assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' }
              },
              required: ['assistant_id']
            }
          },
          {
            name: 'get_one_assistant',
            description: 'Get complete information about a specific assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' }
              },
              required: ['assistant_id']
            }
          },
          {
            name: 'create_assistant',
            description: 'Create a new assistant with comprehensive configuration',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Assistant name' },
                apiKey: { type: 'string', description: 'OpenAI API Key' },
                welcome_message: { type: 'string', description: 'Welcome message', default: 'Hello how can I help you today?' },
                prompt: { type: 'string', description: 'Instructions/Prompt for the assistant' },
                active: { type: 'boolean', description: 'Whether assistant is active', default: true },
                assistant_type: { type: 'string', enum: ['Text Only', 'Voice Only', 'Text & Voice', 'Voice & Text'], description: 'AI Type' },
                ai_platform: { type: 'string', enum: ['openai', 'gemini', 'openrouter', 'deepseek'], description: 'AI Provider' },
                openai_model: { type: 'string', description: 'AI Model', default: 'gpt-3.5-turbo' },
                openai_temperature: { type: 'number', description: 'AI Temperature (0-2)', default: 0.8 },
                booking_bot: { type: 'boolean', description: 'Is booking bot', default: false },
                location: { type: 'string', description: 'GoHighLevel Location' },
                calendar: { type: 'string', description: 'Calendar ID' },
                timezone: { type: 'string', description: 'Timezone' },
                custom_field: { type: 'string', description: 'Custom field' },
                limit_call_time: { type: 'number', description: 'Limit call time in seconds', default: 240 },
                limit_call_tokens: { type: 'number', description: 'Limit call tokens', default: 2000 },
                max_call_tokens: { type: 'number', description: 'Max call tokens', default: 18000 },
                elevenlabs_voice_id: { type: 'string', description: 'ElevenLabs Voice ID' },
                twilio_sid: { type: 'string', description: 'Twilio SID' },
                twilio_token: { type: 'string', description: 'Twilio Token' },
                twilio_phone: { type: 'string', description: 'Twilio Phone Number' },
                twilio_welcome: { type: 'string', description: 'Twilio Welcome Message' },
                twilio_speech_timeout: { type: 'number', description: 'Twilio Speech Timeout', default: 3 },
                twilio_initial_delay: { type: 'number', description: 'Twilio Initial Delay', default: 1 },
                google_calendar: { type: 'boolean', description: 'Google Calendar Integration', default: false },
                webhook_to_send: { type: 'string', description: 'Webhook URL' },
                openai_realtime: { type: 'boolean', description: 'OpenAI Realtime', default: false },
                openai_realtime_voice: { type: 'string', enum: ['alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'], description: 'OpenAI Realtime Voice' },
                openai_websites: { type: 'array', items: { type: 'string' }, description: 'OpenAI Websites' }
              },
              required: ['name', 'apiKey']
            }
          },
          {
            name: 'update_assistant',
            description: 'Update an existing assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' },
                name: { type: 'string', description: 'Assistant name' },
                apiKey: { type: 'string', description: 'OpenAI API Key' },
                welcome_message: { type: 'string', description: 'Welcome message' },
                prompt: { type: 'string', description: 'Instructions/Prompt' },
                active: { type: 'boolean', description: 'Whether assistant is active' },
                assistant_type: { type: 'string', enum: ['Text Only', 'Voice Only', 'Text & Voice', 'Voice & Text'] },
                ai_platform: { type: 'string', enum: ['openai', 'gemini', 'openrouter', 'deepseek'] },
                openai_model: { type: 'string', description: 'AI Model' },
                openai_temperature: { type: 'number', description: 'AI Temperature (0-2)' },
                booking_bot: { type: 'boolean', description: 'Is booking bot' },
                location: { type: 'string', description: 'GoHighLevel Location' },
                calendar: { type: 'string', description: 'Calendar ID' },
                timezone: { type: 'string', description: 'Timezone' },
                custom_field: { type: 'string', description: 'Custom field' }
              },
              required: ['assistant_id']
            }
          },
          {
            name: 'delete_assistant',
            description: 'Delete an assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' }
              },
              required: ['assistant_id']
            }
          },

          // Assistant Files
          {
            name: 'get_assistant_files',
            description: 'Get files associated with an assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' }
              },
              required: ['assistant_id']
            }
          },
          {
            name: 'delete_assistant_file',
            description: 'Delete a specific file from an assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' },
                file_id: { type: 'string', description: 'File ID' }
              },
              required: ['assistant_id', 'file_id']
            }
          },

          // Assistant Usage & Analytics
          {
            name: 'get_assistant_usage',
            description: 'Get usage statistics for an assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' }
              },
              required: ['assistant_id']
            }
          },
          {
            name: 'get_assistants_token_usage',
            description: 'Get token usage across all assistants',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'get_dashboard_assistant',
            description: 'Get the dashboard assistant for the authenticated user',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          // Chat with Assistant
          {
            name: 'chat_with_assistant',
            description: 'Chat with a specific assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' },
                message: { type: 'string', description: 'Message to send' },
                thread_id: { type: 'string', description: 'Chat/Thread ID' },
                audio: { type: 'boolean', description: 'Enable audio response', default: false }
              },
              required: ['assistant_id', 'message', 'thread_id']
            }
          },
          // Twilio Operations
          {
            name: 'connect_twilio',
            description: 'Connect Twilio account credentials',
            inputSchema: {
              type: 'object',
              properties: {
                twilio_sid: { type: 'string', description: 'Twilio Account SID' },
                twilio_token: { type: 'string', description: 'Twilio Auth Token' }
              },
              required: ['twilio_sid', 'twilio_token']
            }
          },
          {
            name: 'disconnect_twilio',
            description: 'Disconnect Twilio account',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'get_twilio_numbers',
            description: 'Get all Twilio phone numbers',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'get_available_numbers',
            description: 'Get available phone numbers for purchase',
            inputSchema: {
              type: 'object',
              properties: {
                country_code: { type: 'string', description: 'Country code', default: 'US' },
                number_type: { type: 'string', enum: ['local', 'tollfree', 'mobile'], description: 'Number type', default: 'local' },
                search_pattern: { type: 'string', description: 'Search for numbers containing this pattern' },
                locality: { type: 'string', description: 'Locality/city for local numbers' }
              },
              required: []
            }
          },
          {
            name: 'buy_twilio_number',
            description: 'Purchase a new Twilio phone number',
            inputSchema: {
              type: 'object',
              properties: {
                phone_number: { type: 'string', description: 'Phone number to purchase' }
              },
              required: ['phone_number']
            }
          },
          {
            name: 'update_twilio_number',
            description: 'Update Twilio number configuration',
            inputSchema: {
              type: 'object',
              properties: {
                number_sid: { type: 'string', description: 'Number SID' },
                friendly_name: { type: 'string', description: 'Friendly name' },
                voice_webhook: { type: 'string', description: 'Voice webhook URL' },
                sms_webhook: { type: 'string', description: 'SMS webhook URL' }
              },
              required: ['number_sid']
            }
          },
          {
            name: 'get_twilio_usage',
            description: 'Get Twilio usage statistics',
            inputSchema: {
              type: 'object',
              properties: {
                start_date: { type: 'string', description: 'Start date (ISO format)' },
                end_date: { type: 'string', description: 'End date (ISO format)' },
                limit: { type: 'number', description: 'Max number of results', default: 50 }
              },
              required: []
            }
          },
          // Call Management
          {
            name: 'make_call',
            description: 'Make a phone call through assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' },
                phone_number: { type: 'string', description: 'Phone number to call' },
                contact_id: { type: 'string', description: 'Contact ID (optional)' }
              },
              required: ['assistant_id', 'phone_number']
            }
          },
          {
            name: 'make_bulk_call',
            description: 'Make bulk phone calls',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' },
                contact_bulk_id: { type: 'string', description: 'Contact bulk ID' }
              },
              required: ['assistant_id', 'contact_bulk_id']
            }
          },
          {
            name: 'get_calls_in_progress',
            description: 'Get all calls currently in progress',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'cancel_call',
            description: 'Cancel an active phone call',
            inputSchema: {
              type: 'object',
              properties: {
                call_id: { type: 'string', description: 'Call ID' }
              },
              required: ['call_id']
            }
          },
          // SMS Operations
          {
            name: 'send_sms',
            description: 'Send SMS message through assistant',
            inputSchema: {
              type: 'object',
              properties: {
                assistant_id: { type: 'string', description: 'Assistant ID' },
                phone_number: { type: 'string', description: 'Phone number to send SMS' },
                message: { type: 'string', description: 'SMS message content' },
                contact_id: { type: 'string', description: 'Contact ID (optional)' }
              },
              required: ['assistant_id', 'phone_number', 'message']
            }
          }
        ]
      };
    });
    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      if (!this.apiKey) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          'VAVICKY_API_KEY environment variable is required'
        );
      }
      try {
        const result = await this.executeTool(name, args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }
  async executeTool(toolName, args) {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    let url, method = 'GET', body = null;
    switch (toolName) {
      // User Management
      case 'get_user':
        url = `${this.baseUrl}/user`;
        break;
      case 'update_white_label':
        url = `${this.baseUrl}/user`;
        method = 'PATCH';
        body = {
          whitelabel_name: args.whitelabel_name,
          whitelabel_description: args.whitelabel_description,
          whitelabel_domain: args.whitelabel_domain,
          whitelabel_color: args.whitelabel_color
        };
        break;
      case 'update_smtp':
        url = `${this.baseUrl}/user/smtp`;
        method = 'PATCH';
        body = {
          smtp_email: args.smtp_email,
          smtp_password: args.smtp_password,
          smtp_host: args.smtp_host,
          smtp_port: args.smtp_port
        };
        break;
      // Token Management
      case 'update_openai_token':
        url = `${this.baseUrl}/openai/oauth`;
        method = 'POST';
        body = { openai_token: args.openai_token };
        break;
      case 'update_elevenlabs_token':
        url = `${this.baseUrl}/elevenlabs/oauth`;
        method = 'POST';
        body = { elevenlabs_token: args.elevenlabs_token };
        break;
      case 'update_deepseek_token':
        url = `${this.baseUrl}/deepseek/oauth`;
        method = 'POST';
        body = { deepseek_token: args.deepseek_token };
        break;
      case 'update_gemini_token':
        url = `${this.baseUrl}/gemini/oauth`;
        method = 'POST';
        body = { gemini_token: args.gemini_token };
        break;
      case 'update_openrouter_token':
        url = `${this.baseUrl}/openrouter/oauth`;
        method = 'POST';
        body = { openrouter_token: args.openrouter_token };
        break;
      // Assistant Management
      case 'get_assistants':
        url = `${this.baseUrl}/assistants`;
        break;

      case 'get_assistant':
        url = `${this.baseUrl}/assistants/${args.assistant_id}`;
        break;

      case 'get_one_assistant':
        url = `${this.baseUrl}/assistants/one/${args.assistant_id}`;
        break;

      case 'create_assistant':
        url = `${this.baseUrl}/assistants`;
        method = 'POST';
        body = this.filterEmptyValues(args);
        break;

      case 'update_assistant':
        url = `${this.baseUrl}/assistants/${args.assistant_id}`;
        method = 'PATCH';
        const { assistant_id, ...updateData } = args;
        body = this.filterEmptyValues(updateData);
        break;

      case 'delete_assistant':
        url = `${this.baseUrl}/assistants/${args.assistant_id}`;
        method = 'DELETE';
        break;

      case 'get_assistant_files':
        url = `${this.baseUrl}/assistants/${args.assistant_id}/files`;
        break;

      case 'delete_assistant_file':
        url = `${this.baseUrl}/assistants/${args.assistant_id}/files/${args.file_id}`;
        method = 'DELETE';
        break;

      case 'get_assistant_usage':
        url = `${this.baseUrl}/assistants/${args.assistant_id}/usage`;
        break;

      case 'get_assistants_token_usage':
        url = `${this.baseUrl}/assistants/all/token/usage`;
        break;

      case 'get_dashboard_assistant':
        url = `${this.baseUrl}/assistants/gohighlevel/dashboard`;
        break;

      case 'chat_with_assistant':
        url = `${this.baseUrl}/assistants/${args.assistant_id}/chat?audio=${args.audio || false}`;
        method = 'POST';
        body = { 
          message: args.message,
          thread_id: args.thread_id 
        };
        break;

      // Twilio Operations
      case 'connect_twilio':
        url = `${this.baseUrl}/twilio/oauth`;
        method = 'POST';
        body = {
          sid: args.twilio_sid,
          token: args.twilio_token
        };
        break;

      case 'disconnect_twilio':
        url = `${this.baseUrl}/twilio/`;
        method = 'DELETE';
        break;

      case 'get_twilio_numbers':
        url = `${this.baseUrl}/twilio/numbers`;
        break;

      case 'get_available_numbers':
        const params = new URLSearchParams();
        if (args.country_code) params.append('code', args.country_code);
        if (args.number_type) params.append('type', args.number_type);
        if (args.search_pattern) params.append('search', args.search_pattern);
        if (args.locality) params.append('locality', args.locality);
        url = `${this.baseUrl}/twilio/numbers/available?${params.toString()}`;
        break;

      case 'buy_twilio_number':
        url = `${this.baseUrl}/twilio/number/buy`;
        method = 'POST';
        body = { phoneNumber: args.phone_number };
        break;

      case 'update_twilio_number':
        url = `${this.baseUrl}/twilio/numbers/${args.number_sid}`;
        method = 'PATCH';
        body = {};
        if (args.friendly_name) body.name = args.friendly_name;
        if (args.voice_webhook) body.webhook = args.voice_webhook;
        if (args.sms_webhook) body.smsWebhook = args.sms_webhook;
        break;

      case 'get_twilio_usage':
        const usageParams = new URLSearchParams();
        if (args.start_date) usageParams.append('start', args.start_date);
        if (args.end_date) usageParams.append('end', args.end_date);
        if (args.limit) usageParams.append('limit', args.limit.toString());
        url = `${this.baseUrl}/twilio/usage?${usageParams.toString()}`;
        break;

      // Call Management
      case 'make_call':
        url = `${this.baseUrl}/twilio/${args.assistant_id}/call`;
        method = 'POST';
        body = {
          phonenumber: args.phone_number
        };
        if (args.contact_id) {
          body.contact_id = args.contact_id;
          body.customData = { phonenumber: args.phone_number };
        }
        break;

      case 'make_bulk_call':
        url = `${this.baseUrl}/twilio/${args.assistant_id}/callbulk/${args.contact_bulk_id}`;
        method = 'POST';
        body = {};
        break;

      case 'get_calls_in_progress':
        url = `${this.baseUrl}/twilio/calls`;
        break;

      case 'cancel_call':
        url = `${this.baseUrl}/twilio/calls/${args.call_id}`;
        method = 'DELETE';
        break;

      // SMS Operations
      case 'send_sms':
        url = `${this.baseUrl}/twilio/${args.assistant_id}/sms`;
        method = 'POST';
        body = {
          phonenumber: args.phone_number,
          message: args.message
        };
        if (args.contact_id) {
          body.contact_id = args.contact_id;
          body.customData = {
            phonenumber: args.phone_number,
            message: args.message
          };
        }
        break;

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    const options = {
      method,
      headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }
  filterEmptyValues(obj) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Vavicky MCP server running on stdio');
  }
}

const server = new VavickyMCPServer();
server.run().catch(console.error);

export { VavickyMCPServer };