// Base fetch wrapper with timeout and retry logic
const API_BASE = import.meta.env.VITE_API_BASE || 'https://hacker-news.firebaseio.com/v0';

/**
 * Fetch with timeout and retry
 * @param {string} endpoint - API endpoint (without .json)
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Timeout in milliseconds (default: 5000)
 * @param {number} options.retries - Number of retry attempts (default: 3)
 * @param {number} options.retryDelay - Base delay for retry in ms (default: 1000)
 * @returns {Promise<any>} - Parsed JSON response
 */
const fetchWithTimeoutAndRetry = async (endpoint, options = {}) => {
  const {
    timeout = 5000,
    retries = 3,
    retryDelay = 1000
  } = options;

  const fetchWithTimeout = (url, opts = {}) => {
    return Promise.race([
      fetch(url, opts),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(`${API_BASE}${endpoint}.json`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      // If we've exhausted retries, break
      if (i === retries) break;
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, retryDelay * Math.pow(2, i))
      );
    }
  }
  
  throw lastError;
};

const api = {
  get: (endpoint) => fetchWithTimeoutAndRetry(endpoint)
};

export default api;