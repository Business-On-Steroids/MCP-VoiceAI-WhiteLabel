import { z } from "zod";
import { backend } from "./backend-client.js";

export function getTools() {
    return [
        // Call Management
        {
            name: 'make_call',
            config: {
                title: 'make_call',
                description: 'Make a phone call through assistant',
                inputSchema: z.object({
                    assistant_id: z.string().describe('Assistant ID'),
                    phone_number: z.string().describe('Phone number to call'),
                    contact_id: z.string().optional().describe('Contact ID (optional)')
                })
            },
            callback: async (args, c) => {
                try {
                    const bearerToken = c.requestInfo.headers;
                    const { assistant_id, phone_number, contact_id } = args;
                    
                    // Make actual API call to backend.vavicky.com
                    const callResult = await backend.twilio.makeCall(args, bearerToken);
                    
                    return {
                        structuredContent: callResult,
                        content: [
                            {
                                type: "text",
                                text: `Call initiated successfully to ${phone_number} using assistant ${assistant_id}. Call ID: ${callResult.callId || callResult.id || 'N/A'}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in make_call:", error);
                    return {
                        content: [{ type: "text", text: `Error making call: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'make_bulk_call',
            config: {
                title: 'make_bulk_call',
                description: 'Make bulk phone calls',
                inputSchema: z.object({
                    assistant_id: z.string().describe('Assistant ID'),
                    contact_bulk_id: z.string().describe('Contact bulk ID')
                })
            },
            callback: async (args, c) => {
                try {
                    const bearerToken = c.requestInfo.headers;
                    const { assistant_id, contact_bulk_id } = args;
                    
                    // Make actual API call to backend.vavicky.com
                    const bulkCallResult = await backend.twilio.makeBulkCall(args, bearerToken);
                    
                    return {
                        structuredContent: bulkCallResult,
                        content: [
                            {
                                type: "text",
                                text: `Bulk call initiated successfully for bulk ID ${contact_bulk_id} using assistant ${assistant_id}. Total calls scheduled: ${bulkCallResult.totalCalls || bulkCallResult.count || 'Unknown'}`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in make_bulk_call:", error);
                    return {
                        content: [{ type: "text", text: `Error making bulk calls: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'get_calls_in_progress',
            config: {
                title: 'get_calls_in_progress',
                description: 'Get all calls currently in progress',
                inputSchema: z.object({})
            },
            callback: async (args, c) => {
                try {
                    // Make actual API call to backend.vavicky.com
                    const bearerToken = c.requestInfo.headers;
                    const callsInProgress = await backend.twilio.getCallsInProgress(bearerToken);
                    
                    const activeCalls = callsInProgress.calls || callsInProgress.activeCalls || [];
                    const callCount = activeCalls.length;
                    
                    let summaryText = `Currently ${callCount} call${callCount !== 1 ? 's' : ''} in progress:\n`;
                    
                    if (callCount > 0) {
                        activeCalls.forEach((call, index) => {
                            summaryText += `${index + 1}. Call to ${call.phoneNumber || call.to || 'Unknown'}`;
                            if (call.duration) summaryText += ` (${call.duration}s)`;
                            if (call.assistantId) summaryText += ` - Assistant: ${call.assistantId}`;
                            if (call.callId) summaryText += ` [ID: ${call.callId}]`;
                            summaryText += '\n';
                        });
                    } else {
                        summaryText += "No active calls at the moment.";
                    }
                    
                    return {
                        structuredContent: callsInProgress,
                        content: [
                            {
                                type: "text",
                                text: summaryText,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_calls_in_progress:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving active calls: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'cancel_call',
            config: {
                title: 'cancel_call',
                description: 'Cancel an active phone call',
                inputSchema: z.object({
                    call_id: z.string().describe('Call ID')
                })
            },
            callback: async (args, c) => {
                try {

                    const bearerToken = c.requestInfo.headers;
                    const { call_id } = args;
                    
                    // Make actual API call to backend.vavicky.com
                    const cancelResult = await backend.twilio.cancelCall(call_id, bearerToken);
                    
                    return {
                        structuredContent: cancelResult,
                        content: [
                            {
                                type: "text",
                                text: `Call ${call_id} has been successfully cancelled.`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in cancel_call:", error);
                    return {
                        content: [{ type: "text", text: `Error cancelling call: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        // SMS Operations
        {
            name: 'send_sms',
            config: {
                title: 'send_sms',
                description: 'Send SMS message through assistant',
                inputSchema: z.object({
                    assistant_id: z.string().describe('Assistant ID'),
                    phone_number: z.string().describe('Phone number to send SMS'),
                    message: z.string().describe('SMS message content'),
                    contact_id: z.string().optional().describe('Contact ID (optional)')
                })
            },
            callback: async (args, c) => {
                try {

                    const bearerToken = c.requestInfo.headers;
                    const { assistant_id, phone_number, message, contact_id } = args;
                    
                    // Make actual API call to backend.vavicky.com
                    const smsResult = await backend.twilio.sendSMS(args, bearerToken);
                    
                    const messagePreview = message.length > 50 ? message.substring(0, 47) + '...' : message;
                    
                    return {
                        structuredContent: smsResult,
                        content: [
                            {
                                type: "text",
                                text: `SMS sent successfully to ${phone_number} using assistant ${assistant_id}. Message: "${messagePreview}"`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in send_sms:", error);
                    return {
                        content: [{ type: "text", text: `Error sending SMS: ${error.message}` }],
                        isError: true
                    };
                }
            }
        }
    ]
}
