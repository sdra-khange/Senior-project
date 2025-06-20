import Cookie from 'cookie-universal';

const cookie = Cookie();

/**
 * Safely parse user data from cookie
 * @param {string} cookieName - Name of the cookie to parse
 * @returns {object|null} - Parsed user data or null if parsing fails
 */
export const safeParseUserData = (cookieName = "user-data") => {
  try {
    const userData = cookie.get(cookieName);
    
    if (!userData) {
      return null;
    }
    
    // Check if userData is already an object
    if (typeof userData === 'object') {
      return userData;
    }
    
    // If it's a string, try to parse it
    if (typeof userData === 'string') {
      return JSON.parse(userData);
    }
    
    return null;
  } catch (error) {
    console.warn(`Failed to parse ${cookieName} from cookie:`, error);
    return null;
  }
};

/**
 * Get user info safely from cookie
 * @returns {object} - User info with safe defaults
 */
export const getUserInfo = () => {
  const user = safeParseUserData();
  
  return {
    username: user?.username || user?.email || '',
    email: user?.email || '',
    id: user?.id || null,
    profile_photo: user?.profile_photo || null,
    user_type: user?.user_type || cookie.get("user-type") || ''
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid auth token
 */
export const isAuthenticated = () => {
  const token = cookie.get("auth-token");
  return !!token;
};

/**
 * Get auth token
 * @returns {string|null} - Auth token or null
 */
export const getAuthToken = () => {
  return cookie.get("auth-token");
};

/**
 * Get user type
 * @returns {string} - User type (patient, doctor, admin)
 */
export const getUserType = () => {
  return cookie.get("user-type") || '';
};

/**
 * Clear all auth-related cookies
 */
export const clearAuthCookies = () => {
  cookie.remove("auth-token");
  cookie.remove("user-type");
  cookie.remove("user-data");
};

export default {
  safeParseUserData,
  getUserInfo,
  isAuthenticated,
  getAuthToken,
  getUserType,
  clearAuthCookies
};
