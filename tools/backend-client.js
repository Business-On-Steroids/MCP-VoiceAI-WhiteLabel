import axios from 'axios';
import dotenv from 'dotenv';
import { getAssistantId, getToken } from '../middlewares/authorization.js';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'https://backend.vavicky.com/vavicky';

// Create axios instance with default config
const backendClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000,
});

// Helper function to make requests with better error handling
export async function makeBackendRequest(headers, method, endpoint, data = null, params = null) {
    try {
        const config = {
            method,
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers ? getToken(headers['authorization']) : undefined,
                'X-MCP-Server': 'true',
                'X-Requested-With': 'XMLHttpRequest'
            },
        };

        if (data) config.data = data;
        if (params) config.params = params;

        const response = await backendClient(config);

        // Log successful requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(` Backend request successful: ${method} ${endpoint}`);
        }

        return response.data;
    } catch (error) {
        console.error(`Backend request failed: ${method} ${endpoint}`);

        // Enhanced error information
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);

            const errorMessage = error.response.data?.message ||
                error.response.data?.error ||
                error.response.data?.detail ||
                `HTTP ${error.response.status}`;

            throw new Error(`Backend Error (${error.response.status}): ${errorMessage}`);

        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received. Possible network issue or backend is down.');
            console.error('Request:', error.request);

            throw new Error('No response from backend server. Check network connectivity and ensure backend is running.');

        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
            throw new Error(`Request setup failed: ${error.message}`);
        }
    }
}

// Add request/response interceptors for logging
backendClient.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(` Sending ${config.method.toUpperCase()} to ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

backendClient.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(` Response from ${response.config.url}: ${response.status}`);
        }
        return response;
    },
    (error) => {
        // Error handling is done in makeBackendRequest
        return Promise.reject(error);
    }
);

// Specific backend API methods for all tools
export const backend = {
    // ===== ASSISTANT ENDPOINTS (from assistants.js) =====
    assistants: {
        // Get assistant by ID
        findById: async (assistantId, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/assistants/${getAssistantId(headers['authorization'])}`);
        },

        // Create new assistant
        create: async (assistantData, headers) => {
            return makeBackendRequest(headers, 'POST', '/api/assistants', assistantData);
        },

        // Update existing assistant
        update: async (assistantId, updateData, headers) => {
            return makeBackendRequest(headers, 'PUT', `/api/assistants/${getAssistantId(headers['authorization'])}`, updateData);
        },

        // Delete assistant
        delete: async (assistantId, headers) => {
            // return makeBackendRequest(headers, 'DELETE', `/api/assistants/${getAssistantId(headers['authorization'])}`);
        },

        // Get assistant usage statistics
        getUsage: async (assistantId, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/assistants/${getAssistantId(headers['authorization'])}/usage`);
        },

        // Get token usage across all assistants
        getAllTokenUsage: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/assistants/token-usage');
        },

        // Additional assistant endpoints that might be useful
        listAll: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/assistants', null, params);
        },

        // Test assistant configuration
        testConfig: async (assistantId, testData, headers) => {
            return makeBackendRequest(headers, 'POST', `/api/assistants/${getAssistantId(headers['authorization'])}/test`, testData);
        },

        // Get assistant logs
        getLogs: async (assistantId, params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/assistants/${getAssistantId(headers['authorization'])}/logs`, null, params);
        },

        // Clone assistant
        clone: async (assistantId, cloneData = {}, headers) => {
            return makeBackendRequest(headers, 'POST', `/api/assistants/${getAssistantId(headers['authorization'])}/clone`, cloneData);
        },

        // Export assistant configuration
        exportConfig: async (assistantId, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/assistants/${getAssistantId(headers['authorization'])}/export`);
        },

        // Import assistant configuration
        importConfig: async (importData, headers) => {
            return makeBackendRequest(headers, 'POST', '/api/assistants/import', importData);
        }
    },

    // ===== TWILIO ENDPOINTS (from twilio.js) =====
    twilio: {
        // Make a single phone call
        makeCall: async (callData, headers) => {
            callData.assistant_id = getAssistantId(headers['authorization']);
            return makeBackendRequest(headers, 'POST', `/api/twilio/${getAssistantId(headers['authorization'])}/calls`, callData);
        },

        // Make bulk phone calls
        makeBulkCall: async (bulkCallData, headers) => {
            callData.assistant_id = getAssistantId(headers['authorization']);
            return makeBackendRequest(headers, 'POST', `/api/twilio/${getAssistantId(headers['authorization'])}/callbulk/${callData.contact_bulk_id}`, bulkCallData);
        },

        // Get calls currently in progress
        getCallsInProgress: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/calls');
        },

        // Cancel an active phone call
        cancelCall: async (callId, headers) => {
            return makeBackendRequest(headers, 'DELETE', `/api/twilio/calls/${callId}`);
        },

        // Send SMS message
        sendSMS: async (smsData, headers) => {
            return makeBackendRequest(headers, 'POST', `/api/twilio/${getAssistantId(headers['authorization'])}/sms`, smsData);
        },

        // Additional Twilio endpoints for enhanced functionality
        getCallDetails: async (callId, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/twilio/calls/${callId}`);
        },

        getCallHistory: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/calls/history', null, params);
        },

        // Get SMS history
        getSMSHistory: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/sms/history', null, params);
        },

        // Get call recordings
        getCallRecordings: async (callId, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/twilio/calls/${callId}/recordings`);
        },

        // Get call analytics
        getCallAnalytics: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/analytics/calls', null, params);
        },

        // Get SMS analytics
        getSMSAnalytics: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/analytics/sms', null, params);
        },

        // Update Twilio configuration
        updateConfig: async (configData, headers) => {
            return makeBackendRequest(headers, 'PUT', '/api/twilio/config', configData);
        },

        // Get Twilio account balance
        getAccountBalance: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/balance');
        },

        // Get available phone numbers
        getAvailableNumbers: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/twilio/numbers/available', null, params);
        },

        // Purchase phone number
        purchaseNumber: async (numberData, headers) => {
            return makeBackendRequest(headers, 'POST', '/api/twilio/numbers/purchase', numberData);
        }
    },

    // ===== USER ENDPOINTS (from users.js) =====
    users: {
        // Get current user data
        getUser: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/users/me');
        },

        // Update user settings
        updateUser: async (userData, headers) => {
            return makeBackendRequest(headers, 'PUT', '/api/users/me', userData);
        },

        // Get user settings
        getUserSettings: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/users/settings');
        },

        // Additional user endpoints
        updateProfile: async (profileData, headers) => {
            return makeBackendRequest(headers, 'PATCH', '/api/users/profile', profileData);
        },

        // Change password
        changePassword: async (passwordData, headers) => {
            return makeBackendRequest(headers, 'POST', '/api/users/change-password', passwordData);
        },

        // Get user API keys
        getApiKeys: async () => {
            return makeBackendRequest(headers, 'GET', '/api/users/api-keys');
        },

        // Create new API key
        createApiKey: async (apiKeyData = {}, headers) => {
            return makeBackendRequest(headers, 'POST', '/api/users/api-keys', apiKeyData);
        },

        // Revoke API key
        revokeApiKey: async (apiKeyId, headers) => {
            return makeBackendRequest(headers, 'DELETE', `/api/users/api-keys/${apiKeyId}`);
        },

        // Get user billing information
        getBillingInfo: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/users/billing');
        },

        // Update billing information
        updateBillingInfo: async (billingData, headers) => {
            return makeBackendRequest(headers, 'PUT', '/api/users/billing', billingData);
        },

        // Get user invoices
        getInvoices: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/users/invoices', null, params);
        },

        // Download invoice
        downloadInvoice: async (invoiceId, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/users/invoices/${invoiceId}/download`);
        },

        // Get user activity log
        getActivityLog: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/users/activity', null, params);
        },

        // Get user notifications
        getNotifications: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/users/notifications', null, params);
        },

        // Mark notifications as read
        markNotificationsRead: async (notificationIds = [], headers) => {
            return makeBackendRequest(headers, 'POST', '/api/users/notifications/read', { notificationIds });
        },

        // Delete notifications
        deleteNotifications: async (notificationIds = [], headers) => {
            return makeBackendRequest(headers, 'DELETE', '/api/users/notifications', { data: { notificationIds } });
        }
    },

    // ===== GENERAL & UTILITY ENDPOINTS =====
    general: {
        // Health check
        health: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/health');
        },

        // Get system status
        getSystemStatus: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/status');
        },

        // Get API documentation
        getApiDocs: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/docs');
        },

        // Get server statistics
        getServerStats: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/stats');
        },

        // Clear cache (admin only)
        clearCache: async (cacheKey = null, headers) => {
            return makeBackendRequest(headers, 'POST', '/api/cache/clear', { cacheKey });
        },

        // Get version information
        getVersion: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/version');
        },

        // Get feature flags
        getFeatureFlags: async (headers) => {
            return makeBackendRequest(headers, 'GET', '/api/features');
        }
    },

    // ===== ANALYTICS ENDPOINTS =====
    analytics: {
        // Get overall platform analytics
        getPlatformAnalytics: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/analytics/platform', null, params);
        },

        // Get user-specific analytics
        getUserAnalytics: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/analytics/user', null, params);
        },

        // Get assistant analytics
        getAssistantAnalytics: async (assistantId, params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', `/api/analytics/assistants/${getAssistantId(headers['authorization'])}`, null, params);
        },

        // Get token usage analytics
        getTokenAnalytics: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/analytics/tokens', null, params);
        },

        // Get call analytics
        getCallAnalytics: async (params = {}, headers) => {
            return makeBackendRequest(headers, 'GET', '/api/analytics/calls', null, params);
        },

        // Export analytics data
        exportAnalytics: async (exportData) => {
            return makeBackendRequest(headers, 'POST', '/api/analytics/export', exportData);
        }
    }
};

// Test the backend connection on startup
export async function testBackendConnection() {
    try {
        console.log(' Testing connection to backend at:', BACKEND_URL);

        const health = await backend.general.health();

        console.log(' Backend connection successful!');
        console.log(' Backend Status:', health.status || 'OK');
        console.log(' Backend Version:', health.version || 'Unknown');
        console.log(' Uptime:', health.uptime ? `${Math.floor(health.uptime / 3600)} hours` : 'Unknown');

        return {
            connected: true,
            details: health
        };
    } catch (error) {
        console.error(' Backend connection test failed:', error.message);
        console.error(' Troubleshooting tips:');
        console.error('  1. Check if BACKEND_URL is correct in .env file');
        console.error('  2. Verify BACKEND_API_KEY is valid and not expired');
        console.error('  3. Ensure backend server is running and accessible');
        console.error('  4. Check network connectivity and firewall settings');
        console.error('  5. Verify CORS settings on backend server');

        return {
            connected: false,
            error: error.message
        };
    }
}

// Initialize connection test on module load (optional)
if (process.env.NODE_ENV === 'development') {
    testBackendConnection().then(result => {
        if (result.connected) {
            console.log(' Backend client initialized successfully');
        } else {
            console.warn('  Backend client initialized with connection issues');
        }
    });
}
