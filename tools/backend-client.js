import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'https://backend.vavicky.com/vavicky';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

if (!BACKEND_API_KEY) {
    console.warn('BACKEND_API_KEY is not set in .env file. Backend requests may fail.');
}

// Create axios instance with default config
const backendClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BACKEND_API_KEY}`,
        'X-MCP-Server': 'true',
        'X-Requested-With': 'XMLHttpRequest'
    },
});

// Helper function to make requests with better error handling
export async function makeBackendRequest(method, endpoint, data = null, params = null) {
    try {
        const config = {
            method,
            url: endpoint,
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
        findById: async (assistantId) => {
            return makeBackendRequest('GET', `/api/assistants/${assistantId}`);
        },
        
        // Create new assistant
        create: async (assistantData) => {
            return makeBackendRequest('POST', '/api/assistants', assistantData);
        },
        
        // Update existing assistant
        update: async (assistantId, updateData) => {
            return makeBackendRequest('PUT', `/api/assistants/${assistantId}`, updateData);
        },
        
        // Delete assistant
        delete: async (assistantId) => {
            return makeBackendRequest('DELETE', `/api/assistants/${assistantId}`);
        },
        
        // Get assistant usage statistics
        getUsage: async (assistantId) => {
            return makeBackendRequest('GET', `/api/assistants/${assistantId}/usage`);
        },
        
        // Get token usage across all assistants
        getAllTokenUsage: async () => {
            return makeBackendRequest('GET', '/api/assistants/token-usage');
        },
        
        // Additional assistant endpoints that might be useful
        listAll: async (params = {}) => {
            return makeBackendRequest('GET', '/api/assistants', null, params);
        },
        
        // Test assistant configuration
        testConfig: async (assistantId, testData) => {
            return makeBackendRequest('POST', `/api/assistants/${assistantId}/test`, testData);
        },
        
        // Get assistant logs
        getLogs: async (assistantId, params = {}) => {
            return makeBackendRequest('GET', `/api/assistants/${assistantId}/logs`, null, params);
        },
        
        // Clone assistant
        clone: async (assistantId, cloneData = {}) => {
            return makeBackendRequest('POST', `/api/assistants/${assistantId}/clone`, cloneData);
        },
        
        // Export assistant configuration
        exportConfig: async (assistantId) => {
            return makeBackendRequest('GET', `/api/assistants/${assistantId}/export`);
        },
        
        // Import assistant configuration
        importConfig: async (importData) => {
            return makeBackendRequest('POST', '/api/assistants/import', importData);
        }
    },
    
    // ===== TWILIO ENDPOINTS (from twilio.js) =====
    twilio: {
        // Make a single phone call
        makeCall: async (callData) => {
            return makeBackendRequest('POST', '/api/twilio/calls', callData);
        },
        
        // Make bulk phone calls
        makeBulkCall: async (bulkCallData) => {
            return makeBackendRequest('POST', '/api/twilio/calls/bulk', bulkCallData);
        },
        
        // Get calls currently in progress
        getCallsInProgress: async () => {
            return makeBackendRequest('GET', '/api/twilio/calls/in-progress');
        },
        
        // Cancel an active phone call
        cancelCall: async (callId) => {
            return makeBackendRequest('DELETE', `/api/twilio/calls/${callId}`);
        },
        
        // Send SMS message
        sendSMS: async (smsData) => {
            return makeBackendRequest('POST', '/api/twilio/sms', smsData);
        },
        
        // Additional Twilio endpoints for enhanced functionality
        getCallDetails: async (callId) => {
            return makeBackendRequest('GET', `/api/twilio/calls/${callId}`);
        },
        
        getCallHistory: async (params = {}) => {
            return makeBackendRequest('GET', '/api/twilio/calls/history', null, params);
        },
        
        // Get SMS history
        getSMSHistory: async (params = {}) => {
            return makeBackendRequest('GET', '/api/twilio/sms/history', null, params);
        },
        
        // Get call recordings
        getCallRecordings: async (callId) => {
            return makeBackendRequest('GET', `/api/twilio/calls/${callId}/recordings`);
        },
        
        // Get call analytics
        getCallAnalytics: async (params = {}) => {
            return makeBackendRequest('GET', '/api/twilio/analytics/calls', null, params);
        },
        
        // Get SMS analytics
        getSMSAnalytics: async (params = {}) => {
            return makeBackendRequest('GET', '/api/twilio/analytics/sms', null, params);
        },
        
        // Update Twilio configuration
        updateConfig: async (configData) => {
            return makeBackendRequest('PUT', '/api/twilio/config', configData);
        },
        
        // Get Twilio account balance
        getAccountBalance: async () => {
            return makeBackendRequest('GET', '/api/twilio/balance');
        },
        
        // Get available phone numbers
        getAvailableNumbers: async (params = {}) => {
            return makeBackendRequest('GET', '/api/twilio/numbers/available', null, params);
        },
        
        // Purchase phone number
        purchaseNumber: async (numberData) => {
            return makeBackendRequest('POST', '/api/twilio/numbers/purchase', numberData);
        }
    },
    
    // ===== USER ENDPOINTS (from users.js) =====
    users: {
        // Get current user data
        getUser: async () => {
            return makeBackendRequest('GET', '/api/users/me');
        },
        
        // Update user settings
        updateUser: async (userData) => {
            return makeBackendRequest('PUT', '/api/users/me', userData);
        },
        
        // Get user settings
        getUserSettings: async () => {
            return makeBackendRequest('GET', '/api/users/settings');
        },
        
        // Additional user endpoints
        updateProfile: async (profileData) => {
            return makeBackendRequest('PATCH', '/api/users/profile', profileData);
        },
        
        // Change password
        changePassword: async (passwordData) => {
            return makeBackendRequest('POST', '/api/users/change-password', passwordData);
        },
        
        // Get user API keys
        getApiKeys: async () => {
            return makeBackendRequest('GET', '/api/users/api-keys');
        },
        
        // Create new API key
        createApiKey: async (apiKeyData = {}) => {
            return makeBackendRequest('POST', '/api/users/api-keys', apiKeyData);
        },
        
        // Revoke API key
        revokeApiKey: async (apiKeyId) => {
            return makeBackendRequest('DELETE', `/api/users/api-keys/${apiKeyId}`);
        },
        
        // Get user billing information
        getBillingInfo: async () => {
            return makeBackendRequest('GET', '/api/users/billing');
        },
        
        // Update billing information
        updateBillingInfo: async (billingData) => {
            return makeBackendRequest('PUT', '/api/users/billing', billingData);
        },
        
        // Get user invoices
        getInvoices: async (params = {}) => {
            return makeBackendRequest('GET', '/api/users/invoices', null, params);
        },
        
        // Download invoice
        downloadInvoice: async (invoiceId) => {
            return makeBackendRequest('GET', `/api/users/invoices/${invoiceId}/download`);
        },
        
        // Get user activity log
        getActivityLog: async (params = {}) => {
            return makeBackendRequest('GET', '/api/users/activity', null, params);
        },
        
        // Get user notifications
        getNotifications: async (params = {}) => {
            return makeBackendRequest('GET', '/api/users/notifications', null, params);
        },
        
        // Mark notifications as read
        markNotificationsRead: async (notificationIds = []) => {
            return makeBackendRequest('POST', '/api/users/notifications/read', { notificationIds });
        },
        
        // Delete notifications
        deleteNotifications: async (notificationIds = []) => {
            return makeBackendRequest('DELETE', '/api/users/notifications', { data: { notificationIds } });
        }
    },
    
    // ===== GENERAL & UTILITY ENDPOINTS =====
    general: {
        // Health check
        health: async () => {
            return makeBackendRequest('GET', '/api/health');
        },
        
        // Get system status
        getSystemStatus: async () => {
            return makeBackendRequest('GET', '/api/status');
        },
        
        // Get API documentation
        getApiDocs: async () => {
            return makeBackendRequest('GET', '/api/docs');
        },
        
        // Get server statistics
        getServerStats: async () => {
            return makeBackendRequest('GET', '/api/stats');
        },
        
        // Clear cache (admin only)
        clearCache: async (cacheKey = null) => {
            return makeBackendRequest('POST', '/api/cache/clear', { cacheKey });
        },
        
        // Get version information
        getVersion: async () => {
            return makeBackendRequest('GET', '/api/version');
        },
        
        // Get feature flags
        getFeatureFlags: async () => {
            return makeBackendRequest('GET', '/api/features');
        }
    },
    
    // ===== ANALYTICS ENDPOINTS =====
    analytics: {
        // Get overall platform analytics
        getPlatformAnalytics: async (params = {}) => {
            return makeBackendRequest('GET', '/api/analytics/platform', null, params);
        },
        
        // Get user-specific analytics
        getUserAnalytics: async (params = {}) => {
            return makeBackendRequest('GET', '/api/analytics/user', null, params);
        },
        
        // Get assistant analytics
        getAssistantAnalytics: async (assistantId, params = {}) => {
            return makeBackendRequest('GET', `/api/analytics/assistants/${assistantId}`, null, params);
        },
        
        // Get token usage analytics
        getTokenAnalytics: async (params = {}) => {
            return makeBackendRequest('GET', '/api/analytics/tokens', null, params);
        },
        
        // Get call analytics
        getCallAnalytics: async (params = {}) => {
            return makeBackendRequest('GET', '/api/analytics/calls', null, params);
        },
        
        // Export analytics data
        exportAnalytics: async (exportData) => {
            return makeBackendRequest('POST', '/api/analytics/export', exportData);
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
