export function getTools() {
    return [
        // Call Management
        {
            name: 'make_call',
            config: {
                title: 'make_call',
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
            name: 'make_bulk_call',
            config: {
                title: 'make_bulk_call',
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
            name: 'get_calls_in_progress',
            config: {
                title: 'get_calls_in_progress',
                description: 'Get all calls currently in progress',
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
        },
        {
            name: 'cancel_call',
            config: {
                title: 'cancel_call',
                description: 'Cancel an active phone call',
                inputSchema: {
                    type: 'object',
                    properties: {
                        call_id: { type: 'string', description: 'Call ID' }
                    },
                    required: ['call_id']
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
        // SMS Operations
        {
            name: 'send_sms',
            config: {
                title: 'send_sms',
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