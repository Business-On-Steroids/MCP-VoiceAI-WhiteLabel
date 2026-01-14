export function getTools() {
    return [
        {
            name: 'get_assistant',
            config: {
                title: 'get_assistant',
                description: 'Get basic information about a specific assistant',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assistant_id: { type: 'string', description: 'Assistant ID' }
                    },
                    required: ['assistant_id']
                }
            },
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        },
        {
            name: 'get_one_assistant',
            config: {
                title: 'get_one_assistant',
                description: 'Get complete information about a specific assistant',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assistant_id: { type: 'string', description: 'Assistant ID' }
                    },
                    required: ['assistant_id']
                }
            },
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        },
        {
            name: 'create_assistant',
            config: {
                title: 'create_assistant',
                description: 'Create a new assistant with comprehensive configuration',
                inputSchema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'Assistant name' },
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
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        },
        {
            name: 'update_assistant',
            config: {
                title: 'update_assistant',
                description: 'Update an existing assistant',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assistant_id: { type: 'string', description: 'Assistant ID' },
                        title: { type: 'string', description: 'Assistant name' },
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
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        },
        {
            name: 'delete_assistant',
            config: {
                title: 'delete_assistant',
                description: 'Delete an assistant',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assistant_id: { type: 'string', description: 'Assistant ID' }
                    },
                    required: ['assistant_id']
                }
            },
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        },
        {
            name: 'get_assistant_usage',
            config: {
                title: 'get_assistant_usage',
                description: 'Get usage statistics for an assistant',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assistant_id: { type: 'string', description: 'Assistant ID' }
                    },
                    required: ['assistant_id']
                }
            },
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        },
        {
            name: 'get_assistants_token_usage',
            config: {
                title: 'get_assistants_token_usage',
                description: 'Get token usage across all assistants',
                inputSchema: {
                    type: 'object',
                    properties: {},
                    required: []
                }
            },
            callback: (args) => {
                
                return {
                    structuredContent: args,
                    content: [
                        {
                            type: "text",
                            text: "Done",

                        },
                    ],
                }
            }
        }
    ]
}