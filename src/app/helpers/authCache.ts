/**
 * Authentication cache utilities for storing and managing login state
 */

export interface AuthCacheData {
  token: string;
  token_type: string;
  expires_in: number;
  timestamp: number;
  username: string;
}

const AUTH_CACHE_KEY = "auth_cache";
const DEFAULT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Store authentication data in browser cache
 */
export function storeAuthCache(authData: {
  token: string;
  token_type?: string;
  expires_in?: number;
  username: string;
}): void {
  const cacheData: AuthCacheData = {
    token: authData.token,
    token_type: authData.token_type || "bearer",
    expires_in: authData.expires_in || 1800, // Default 30 minutes
    timestamp: Date.now(),
    username: authData.username,
  };

  try {
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to store auth cache:", error);
  }
}

/**
 * Retrieve authentication data from browser cache
 */
export function getAuthCache(): AuthCacheData | null {
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;

    const cacheData: AuthCacheData = JSON.parse(cached);

    // Check if cache has expired
    const expirationTime = cacheData.timestamp + cacheData.expires_in * 1000;
    if (Date.now() > expirationTime) {
      clearAuthCache();
      return null;
    }

    return cacheData;
  } catch (error) {
    console.warn("Failed to retrieve auth cache:", error);
    clearAuthCache();
    return null;
  }
}

/**
 * Check if user is currently authenticated (has valid cached auth)
 */
export function isAuthenticated(): boolean {
  const cached = getAuthCache();
  return cached !== null;
}

/**
 * Clear authentication cache
 */
export function clearAuthCache(): void {
  try {
    localStorage.removeItem(AUTH_CACHE_KEY);
  } catch (error) {
    console.warn("Failed to clear auth cache:", error);
  }
}

/**
 * Get remaining time in seconds before cache expires
 */
export function getCacheRemainingTime(): number {
  const cached = getAuthCache();
  if (!cached) return 0;

  const expirationTime = cached.timestamp + cached.expires_in * 1000;
  const remaining = Math.max(0, expirationTime - Date.now());
  return Math.floor(remaining / 1000);
}
