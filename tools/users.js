import { z } from "zod";
import { backend } from "./backend-client.js";

export function getTools() {
    return [
        {
            name: 'get_user',
            config: {
                title: 'Get User',
                description: 'Get user data including tokens and settings',
                inputSchema: z.object({})
            },
            callback: async (args, c) => {
                try {
                    // Make actual API call to backend to get current user data
                    const bearerToken = c.requestInfo.headers;
                    const userData = await backend.users.getUser(bearerToken);
                    
                    if (!userData) {
                        return {
                            content: [{ type: "text", text: "User data not found" }],
                            isError: true
                        };
                    }
                    
                    // Format a user-friendly summary
                    const { email, name, tokens, settings, subscription, createdAt } = userData;
                    
                    let userSummary = `User Profile:\n`;
                    if (name) userSummary += `Name: ${name}\n`;
                    if (email) userSummary += `Email: ${email}\n`;
                    
                    // Token information
                    if (tokens) {
                        userSummary += `\nToken Usage:\n`;
                        if (tokens.available !== undefined) userSummary += `Available: ${tokens.available}\n`;
                        if (tokens.used !== undefined) userSummary += `Used: ${tokens.used}\n`;
                        if (tokens.total !== undefined) userSummary += `Total: ${tokens.total}\n`;
                        if (tokens.resetDate) userSummary += `Resets on: ${new Date(tokens.resetDate).toLocaleDateString()}\n`;
                    }
                    
                    // Subscription information
                    if (subscription) {
                        userSummary += `\nSubscription:\n`;
                        if (subscription.plan) userSummary += `Plan: ${subscription.plan}\n`;
                        if (subscription.status) userSummary += `Status: ${subscription.status}\n`;
                        if (subscription.expiresAt) userSummary += `Expires: ${new Date(subscription.expiresAt).toLocaleDateString()}\n`;
                    }
                    
                    // Account creation date
                    if (createdAt) {
                        userSummary += `\nAccount Created: ${new Date(createdAt).toLocaleDateString()}`;
                    }
                    
                    return {
                        structuredContent: userData,
                        content: [
                            {
                                type: "text",
                                text: userSummary,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_user:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving user data: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'update_user_settings',
            config: {
                title: 'Update User Settings',
                description: 'Update user preferences and settings',
                inputSchema: z.object({
                    notifications_enabled: z.boolean().optional().describe('Enable notifications'),
                    email_notifications: z.boolean().optional().describe('Email notifications'),
                    timezone: z.string().optional().describe('Timezone (e.g., America/New_York)'),
                    language: z.string().optional().describe('Language preference'),
                    theme: z.enum(['light', 'dark', 'auto']).optional().describe('UI theme'),
                    assistant_limit: z.number().optional().describe('Maximum assistants allowed'),
                    call_recording_enabled: z.boolean().optional().describe('Enable call recordings')
                })
            },
            callback: async (args, c) => {
                try {
                    // Make actual API call to backend to update user settings
                    const bearerToken = c.requestInfo.headers;
                    const updateResult = await backend.users.updateUser(args, bearerToken);
                    
                    return {
                        structuredContent: updateResult,
                        content: [
                            {
                                type: "text",
                                text: `User settings updated successfully.`,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in update_user_settings:", error);
                    return {
                        content: [{ type: "text", text: `Error updating user settings: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'get_user_settings',
            config: {
                title: 'Get User Settings',
                description: 'Get current user preferences and settings',
                inputSchema: z.object({})
            },
            callback: async (args, c) => {
                try {
                    // Make actual API call to backend to get user settings
                    const bearerToken = c.requestInfo.headers;
                    const settings = await backend.users.getUserSettings(bearerToken);
                    
                    let settingsSummary = `User Settings:\n`;
                    
                    if (settings) {
                        if (settings.notifications_enabled !== undefined) {
                            settingsSummary += `Notifications: ${settings.notifications_enabled ? 'Enabled' : 'Disabled'}\n`;
                        }
                        if (settings.email_notifications !== undefined) {
                            settingsSummary += `Email Notifications: ${settings.email_notifications ? 'Enabled' : 'Disabled'}\n`;
                        }
                        if (settings.timezone) {
                            settingsSummary += `Timezone: ${settings.timezone}\n`;
                        }
                        if (settings.language) {
                            settingsSummary += `Language: ${settings.language}\n`;
                        }
                        if (settings.theme) {
                            settingsSummary += `Theme: ${settings.theme}\n`;
                        }
                        if (settings.assistant_limit !== undefined) {
                            settingsSummary += `Assistant Limit: ${settings.assistant_limit}\n`;
                        }
                        if (settings.call_recording_enabled !== undefined) {
                            settingsSummary += `Call Recording: ${settings.call_recording_enabled ? 'Enabled' : 'Disabled'}\n`;
                        }
                    }
                    
                    return {
                        structuredContent: settings,
                        content: [
                            {
                                type: "text",
                                text: settingsSummary,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_user_settings:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving user settings: ${error.message}` }],
                        isError: true
                    };
                }
            }
        },
        {
            name: 'get_user_token_balance',
            config: {
                title: 'Get User Token Balance',
                description: 'Get current token balance and usage information',
                inputSchema: z.object({})
            },
            callback: async (args, c) => {
                try {
                    // Get user data which includes token information
                    const bearerToken = c.requestInfo.headers;
                    const userData = await backend.users.getUser(bearerToken);
                    
                    if (!userData || !userData.tokens) {
                        return {
                            content: [{ type: "text", text: "Token information not available" }],
                            isError: true
                        };
                    }
                    
                    const { tokens } = userData;
                    
                    let tokenSummary = `Token Balance:\n`;
                    
                    if (tokens.available !== undefined) {
                        tokenSummary += `Available: ${tokens.available.toLocaleString()} tokens\n`;
                    }
                    if (tokens.used !== undefined) {
                        tokenSummary += `Used: ${tokens.used.toLocaleString()} tokens\n`;
                    }
                    if (tokens.total !== undefined) {
                        tokenSummary += `Total: ${tokens.total.toLocaleString()} tokens\n`;
                    }
                    
                    // Calculate percentage if possible
                    if (tokens.used !== undefined && tokens.total !== undefined && tokens.total > 0) {
                        const percentageUsed = ((tokens.used / tokens.total) * 100).toFixed(1);
                        tokenSummary += `Usage: ${percentageUsed}%\n`;
                    }
                    
                    if (tokens.resetDate) {
                        const resetDate = new Date(tokens.resetDate);
                        const today = new Date();
                        const daysUntilReset = Math.ceil((resetDate - today) / (1000 * 60 * 60 * 24));
                        
                        tokenSummary += `\nNext reset: ${resetDate.toLocaleDateString()} (in ${daysUntilReset} days)`;
                    }
                    
                    return {
                        structuredContent: tokens,
                        content: [
                            {
                                type: "text",
                                text: tokenSummary,
                            },
                        ],
                    };
                } catch (error) {
                    console.error("Error in get_user_token_balance:", error);
                    return {
                        content: [{ type: "text", text: `Error retrieving token balance: ${error.message}` }],
                        isError: true
                    };
                }
            }
        }
    ]
}
