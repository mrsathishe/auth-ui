/**
 * Utility functions for handling authentication callback URLs
 */

export interface AuthCallbackParams {
  auth_status: "success" | "error";
  auth_method: "login" | "register";
  timestamp: string;
  // Token-based authentication parameters
  token?: string;
  token_type?: string;
  expires_in?: string;
  // Legacy user-based parameters (for backwards compatibility)
  user_id?: string;
  username?: string;
  // Error parameters
  error_code?: string;
  error_message?: string;
}

/**
 * Constructs a callback URL with authentication status parameters
 * @param baseUrl - The base callback URL
 * @param params - Authentication parameters to append
 * @returns The complete URL with parameters
 */
export function constructCallbackUrl(
  baseUrl: string,
  params: AuthCallbackParams
): string {
  const url = new URL(baseUrl);

  // Add all provided parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value.toString());
    }
  });

  return url.toString();
}

/**
 * Creates token-based success callback parameters
 */
export function createTokenSuccessParams(
  method: "login" | "register",
  token: string,
  tokenType?: string,
  expiresIn?: number
): AuthCallbackParams {
  return {
    auth_status: "success",
    auth_method: method,
    timestamp: Date.now().toString(),
    token,
    token_type: tokenType || "bearer",
    expires_in: expiresIn?.toString(),
  };
}

/**
 * Creates success callback parameters (legacy user-based)
 */
export function createSuccessParams(
  method: "login" | "register",
  user?: { id?: string; username?: string },
  fallbackUsername?: string
): AuthCallbackParams {
  return {
    auth_status: "success",
    auth_method: method,
    timestamp: Date.now().toString(),
    user_id: user?.id || "",
    username: user?.username || fallbackUsername || "",
  };
}

/**
 * Creates error callback parameters
 */
export function createErrorParams(
  method: "login" | "register",
  errorCode: string,
  errorMessage: string
): AuthCallbackParams {
  return {
    auth_status: "error",
    auth_method: method,
    timestamp: Date.now().toString(),
    error_code: errorCode,
    error_message: errorMessage,
  };
}
