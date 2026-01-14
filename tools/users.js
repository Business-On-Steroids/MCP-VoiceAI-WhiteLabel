export function getTools() {
    return [
        {
            name: 'get_user',
            config: {
                title: 'Get User',
                description: 'Get user data including tokens and settings',
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