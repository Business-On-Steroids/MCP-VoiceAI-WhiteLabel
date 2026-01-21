
import { z } from "zod";

import { backend } from "./backend-client.js";

export function getTools() {
    return [
        {
            name: 'get_assistant',
            config: {
                title: 'get_assistant',
                description: 'Get basic information about a specific assistant',
                inputSchema: z.object({
                    // assistant_id: z.string().describe('Assistant ID')
                })
            },
            callback: async (args, c) => {
                try {
                    const bearerToken = c.requestInfo.headers;
                    const { assistant_id } = args;

                    // Make actual API call to backend
                    const assistant = await backend.assistants.findById(assistant_id, bearerToken);

                    if (!assistant) {
                        return {
                            content: [{ type: "text", text: "Assistant not found" }],
                            isError: true
                        };
                    }

                    return {
                        structuredContent: assistant,
                        content: [
                            {
                                type: "text",
                                text: `Found assistant: ${assistant.title || assistant.name || assistant_id}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_assistant:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving assistant: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'get_one_assistant',
            config: {
                title: 'get_one_assistant',
                description: 'Get complete information about a specific assistant',
                inputSchema: z.object({
                    // assistant_id: z.string().describe('Assistant ID')
                })
            },
            callback: async (args, c) => {
                try {
                    const { assistant_id } = args;

                    // Make actual API call to backend
                    const bearerToken = c.requestInfo.headers;
                    const assistant = await backend.assistants.findById(assistant_id, bearerToken);

                    if (!assistant) {
                        return {
                            content: [{ type: "text", text: "Assistant not found" }],
                            isError: true
                        };
                    }

                    return {
                        structuredContent: assistant,
                        content: [
                            {
                                type: "text",
                                text: `Retrieved complete details for assistant: ${assistant.title || assistant.name || assistant_id}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_one_assistant:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving assistant details: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'create_assistant',
            config: {
                title: 'create_assistant',
                description: 'Create a new assistant with comprehensive configuration',
                inputSchema: z.object({
                    title: z.string().describe('Assistant name'),
                    apiKey: z.string().describe('OpenAI API Key'),
                    welcome_message: z.string().default('Hello how can I help you today?').describe('Welcome message'),
                    prompt: z.string().describe('Instructions/Prompt for the assistant'),
                    active: z.boolean().default(true).describe('Whether assistant is active'),
                    assistant_type: z.string().optional().describe("Assistant type from these options" + ['Text Only', 'Voice Only', 'Text & Voice', 'Voice & Text'].join(', ')),
                    ai_platform: z.string().optional().describe("AI Platform to used from these options: " + ['openai', 'gemini', 'openrouter', 'deepseek'].join(', ')),
                    openai_model: z.string().default('gpt-3.5-turbo').describe('AI Model'),
                    openai_temperature: z.number().default(0.8).describe('AI Temperature (0-2)'),
                    booking_bot: z.boolean().default(false).describe('Is booking bot'),
                    location: z.string().optional().describe('GoHighLevel Location'),
                    calendar: z.string().optional().describe('Calendar ID'),
                    timezone: z.string().optional().describe('Timezone'),
                    custom_field: z.string().optional().describe('Custom field'),
                    limit_call_time: z.number().default(240).describe('Limit call time in seconds'),
                    limit_call_tokens: z.number().default(2000).describe('Limit call tokens'),
                    max_call_tokens: z.number().default(18000).describe('Max call tokens'),
                    elevenlabs_voice_id: z.string().optional().describe('ElevenLabs Voice ID'),
                    twilio_sid: z.string().optional().describe('Twilio SID'),
                    twilio_token: z.string().optional().describe('Twilio Token'),
                    twilio_phone: z.string().optional().describe('Twilio Phone Number'),
                    twilio_welcome: z.string().optional().describe('Twilio Welcome Message'),
                    twilio_speech_timeout: z.number().default(3).describe('Twilio Speech Timeout'),
                    twilio_initial_delay: z.number().default(1).describe('Twilio Initial Delay'),
                    google_calendar: z.boolean().default(false).describe('Google Calendar Integration'),
                    webhook_to_send: z.string().optional().describe('Webhook URL'),
                    openai_realtime: z.boolean().default(false).describe('OpenAI Realtime'),
                    openai_realtime_voice: z.string().optional().describe("OpenAI Realtime Voice to used from these options: " + ['alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer'].join(', ')),

                    // openai_websites: z.array(z.string()).optional().describe('OpenAI Websites')
                })
            },
            callback: async (args, c) => {
                try {
                    // Make actual API call to backend
                    const bearerToken = c.requestInfo.headers;
                    const createdAssistant = await backend.assistants.create(args, bearerToken);

                    return {
                        structuredContent: createdAssistant,
                        content: [
                            {
                                type: "text",
                                text: `Successfully created assistant: ${args.title}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in create_assistant:", error);
                    return {
                        content: [{ type: "text", text: `Error creating assistant: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'update_assistant',
            config: {
                title: 'update_assistant',
                description: 'Update an existing assistant',
                inputSchema: z.object({
                    // assistant_id: z.string().describe('Assistant ID'),
                    title: z.string().optional().describe('Assistant name'),
                    apiKey: z.string().optional().describe('OpenAI API Key'),
                    welcome_message: z.string().optional().describe('Welcome message'),
                    prompt: z.string().optional().describe('Instructions/Prompt'),
                    active: z.boolean().optional().describe('Whether assistant is active'),
                    assistant_type: z.string().optional().describe("Assistant type from these options" + ['Text Only', 'Voice Only', 'Text & Voice', 'Voice & Text'].join(', ')),
                    ai_platform: z.string().optional().describe("AI Platform to used from these options: " + ['openai', 'gemini', 'openrouter', 'deepseek'].join(', ')),
                    openai_model: z.string().optional().describe('AI Model'),
                    openai_temperature: z.number().optional().describe('AI Temperature (0-2)'),
                    booking_bot: z.boolean().optional().describe('Is booking bot'),
                    location: z.string().optional().describe('GoHighLevel Location'),
                    calendar: z.string().optional().describe('Calendar ID'),
                    timezone: z.string().optional().describe('Timezone'),
                    custom_field: z.string().optional().describe('Custom field')
                })
            },
            callback: async (args, c) => {
                try {
                    const { assistant_id, ...updateData } = args;

                    // Make actual API call to backend
                    const bearerToken = c.requestInfo.headers;
                    const updatedAssistant = await backend.assistants.update(assistant_id, updateData, bearerToken);

                    return {
                        structuredContent: updatedAssistant,
                        content: [
                            {
                                type: "text",
                                text: `Successfully updated assistant: ${assistant_id}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in update_assistant:", error);
                    return {
                        content: [{ type: "text", text: `Error updating assistant: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'delete_assistant',
            config: {
                title: 'delete_assistant',
                description: 'Delete an assistant',
                inputSchema: z.object({
                    // assistant_id: z.string().describe('Assistant ID')
                })
            },
            callback: async (args, c) => {
                try {
                    const { assistant_id } = args;

                    // Make actual API call to backend
                    const bearerToken = c.requestInfo.headers;
                    const result = await backend.assistants.delete(assistant_id, bearerToken);

                    return {
                        structuredContent: result,
                        content: [
                            {
                                type: "text",
                                text: `Successfully deleted assistant: ${assistant_id}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in delete_assistant:", error);
                    return {
                        content: [{ type: "text", text: `Error deleting assistant: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'get_assistant_usage',
            config: {
                title: 'get_assistant_usage',
                description: 'Get usage statistics for an assistant',
                inputSchema: z.object({
                    // assistant_id: z.string().describe('Assistant ID')
                })
            },
            callback: async (args, c) => {
                try {
                    const { assistant_id } = args;

                    // Make actual API call to backend
                    const bearerToken = c.requestInfo.headers;
                    const usageStats = await backend.assistants.getUsage(assistant_id, bearerToken);

                    const summary = usageStats.summary || usageStats;
                    const text = `Usage for ${assistant_id}:
                    - Total calls: ${summary.totalCalls || 0}
                    - Total tokens: ${summary.totalTokens || 0}
                    - Total duration: ${summary.totalDuration || 0} seconds
                    - Last active: ${summary.lastActive || 'Never'}`;

                    return {
                        structuredContent: usageStats,
                        content: [
                            {
                                type: "text",
                                text: text,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_assistant_usage:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving usage stats: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'get_assistants_token_usage',
            config: {
                title: 'get_assistants_token_usage',
                description: 'Get token usage across all assistants',
                inputSchema: z.object({})
            },
            callback: async (args, c) => {
                try {
                    // Make actual API call to backend
                    const bearerToken = c.requestInfo.headers;
                    const tokenUsage = await backend.assistants.getAllTokenUsage(bearerToken);

                    const totalTokens = tokenUsage.totalTokens || 0;
                    const assistantsCount = tokenUsage.assistantsCount || Object.keys(tokenUsage).length;

                    return {
                        structuredContent: tokenUsage,
                        content: [
                            {
                                type: "text",
                                text: `Total token usage across all assistants: ${totalTokens} tokens (${assistantsCount} assistants)`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_assistants_token_usage:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving token usage: ${error.message}` }],
                        isError: true
                    };
                }
            }
        }
    ]
}
