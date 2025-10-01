/**
 * Environment configuration for the frontend
 * All environment variables must be prefixed with VITE_ to be accessible in the browser
 */

interface Config {
  apiBaseUrl: string;
  socketUrl: string;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isPreview: boolean;
}

const config: Config = {
  // API base URL for HTTP requests
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

  // Socket.IO server URL
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',

  // Environment
  nodeEnv: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',

  // Environment flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isPreview: import.meta.env.VITE_NODE_ENV === 'preview',
};

// Helper function to create API URLs
export const createApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${config.apiBaseUrl}/${cleanPath}`;
};

// Helper function to create full API URLs (including /api prefix)
export const createFullApiUrl = (path: string): string => {
  // Remove leading slash if present
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Remove /api prefix if present (since we'll add it back)
  if (cleanPath.startsWith('api/')) {
    cleanPath = cleanPath.slice(4);
  }

  // Ensure we don't have double slashes
  const basePath = config.apiBaseUrl.endsWith('/') ? config.apiBaseUrl.slice(0, -1) : config.apiBaseUrl;

  return `${basePath}/api/${cleanPath}`;
};

export default config;
