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
  // Check if we're in a browser environment
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

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
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }

    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;

    const cacheData: AuthCacheData = JSON.parse(cached);

    // Check if the cache has expired
    const now = Date.now();
    const expirationTime = cacheData.timestamp + cacheData.expires_in * 1000;

    if (now >= expirationTime) {
      // Cache has expired, clear it
      clearAuthCache();
      return null;
    }

    return cacheData;
  } catch (error) {
    console.warn("Failed to retrieve auth cache:", error);
    // Clear corrupted cache data
    clearAuthCache();
    return null;
  }
}

/**
 * Check if user is currently authenticated based on cache
 */
export function isAuthenticated(): boolean {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return false;
  }

  const cache = getAuthCache();
  return cache !== null;
}

/**
 * Clear authentication cache
 */
export function clearAuthCache(): void {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    localStorage.removeItem(AUTH_CACHE_KEY);
  } catch (error) {
    console.warn("Failed to clear auth cache:", error);
  }
}

/**
 * Get remaining time until cache expires (in milliseconds)
 */
export function getCacheRemainingTime(): number {
  const cache = getAuthCache();
  if (!cache) return 0;

  const now = Date.now();
  const expirationTime = cache.timestamp + cache.expires_in * 1000;
  const remaining = expirationTime - now;

  return Math.max(0, remaining);
}

/**
 * Check if cache will expire within specified minutes
 */
export function isCacheExpiringSoon(minutes: number = 5): boolean {
  const remainingTime = getCacheRemainingTime();
  const thresholdTime = minutes * 60 * 1000; // Convert minutes to milliseconds

  return remainingTime > 0 && remainingTime <= thresholdTime;
}

/**
 * Extend cache expiration by specified duration (in seconds)
 */
export function extendCacheExpiration(
  additionalSeconds: number = 1800
): boolean {
  const cache = getAuthCache();
  if (!cache) return false;

  const updatedCache: AuthCacheData = {
    ...cache,
    expires_in: cache.expires_in + additionalSeconds,
  };

  try {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(updatedCache));
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Failed to extend cache expiration:", error);
    return false;
  }
}
