import {
  constructCallbackUrl,
  createTokenSuccessParams,
  createSuccessParams,
  createErrorParams,
  AuthCallbackParams,
} from "../callbackUtils";

// Mock Date.now
const mockDateNow = jest.fn();
Date.now = mockDateNow;

// Mock URL constructor
const mockUrl = {
  searchParams: {
    set: jest.fn(),
  },
  toString: jest.fn(),
};

global.URL = jest.fn().mockImplementation(() => mockUrl);

describe("Callback Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDateNow.mockReturnValue(1642780800000);
    mockUrl.toString.mockReturnValue(
      "http://example.com/callback?params=added"
    );
  });

  describe("constructCallbackUrl", () => {
    it("constructs URL with all provided parameters", () => {
      const baseUrl = "http://example.com/callback";
      const params: AuthCallbackParams = {
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        token: "test-token",
        token_type: "bearer",
        expires_in: "1800",
      };

      const result = constructCallbackUrl(baseUrl, params);

      expect(global.URL).toHaveBeenCalledWith(baseUrl);
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "auth_status",
        "success"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "auth_method",
        "login"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "timestamp",
        "1642780800000"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "token",
        "test-token"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "token_type",
        "bearer"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "expires_in",
        "1800"
      );
      expect(result).toBe("http://example.com/callback?params=added");
    });

    it("skips undefined, null, and empty parameters", () => {
      const baseUrl = "http://example.com/callback";
      const params: AuthCallbackParams = {
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        token: undefined,
        token_type: "",
        expires_in: null as any,
        user_id: "valid-id",
      };

      constructCallbackUrl(baseUrl, params);

      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "auth_status",
        "success"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "auth_method",
        "login"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "timestamp",
        "1642780800000"
      );
      expect(mockUrl.searchParams.set).toHaveBeenCalledWith(
        "user_id",
        "valid-id"
      );

      // Should not be called for undefined, null, or empty values
      expect(mockUrl.searchParams.set).not.toHaveBeenCalledWith(
        "token",
        expect.anything()
      );
      expect(mockUrl.searchParams.set).not.toHaveBeenCalledWith(
        "token_type",
        expect.anything()
      );
      expect(mockUrl.searchParams.set).not.toHaveBeenCalledWith(
        "expires_in",
        expect.anything()
      );
    });
  });

  describe("createTokenSuccessParams", () => {
    it("creates token success parameters with all fields", () => {
      const result = createTokenSuccessParams(
        "login",
        "test-token",
        "bearer",
        1800
      );

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        token: "test-token",
        token_type: "bearer",
        expires_in: "1800",
      });
    });

    it("uses default token_type when not provided", () => {
      const result = createTokenSuccessParams("register", "test-token");

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "register",
        timestamp: "1642780800000",
        token: "test-token",
        token_type: "bearer",
        expires_in: undefined,
      });
    });

    it("handles undefined expires_in", () => {
      const result = createTokenSuccessParams(
        "login",
        "test-token",
        "custom",
        undefined
      );

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        token: "test-token",
        token_type: "custom",
        expires_in: undefined,
      });
    });
  });

  describe("createSuccessParams", () => {
    it("creates user success parameters with all fields", () => {
      const user = { id: "user-123", username: "testuser" };
      const result = createSuccessParams("login", user);

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        user_id: "user-123",
        username: "testuser",
      });
    });

    it("uses fallback username when user.username is not provided", () => {
      const user = { id: "user-123" };
      const result = createSuccessParams(
        "register",
        user,
        "fallback@example.com"
      );

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "register",
        timestamp: "1642780800000",
        user_id: "user-123",
        username: "fallback@example.com",
      });
    });

    it("handles undefined user object", () => {
      const result = createSuccessParams(
        "login",
        undefined,
        "fallback@example.com"
      );

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        user_id: "",
        username: "fallback@example.com",
      });
    });

    it("handles empty user object", () => {
      const result = createSuccessParams("login", {});

      expect(result).toEqual({
        auth_status: "success",
        auth_method: "login",
        timestamp: "1642780800000",
        user_id: "",
        username: "",
      });
    });
  });

  describe("createErrorParams", () => {
    it("creates error parameters with all fields", () => {
      const result = createErrorParams("login", "401", "invalid_credentials");

      expect(result).toEqual({
        auth_status: "error",
        auth_method: "login",
        timestamp: "1642780800000",
        error_code: "401",
        error_message: "invalid_credentials",
      });
    });

    it("handles different error scenarios", () => {
      const networkError = createErrorParams(
        "register",
        "network",
        "connection_failed"
      );
      expect(networkError.error_code).toBe("network");
      expect(networkError.error_message).toBe("connection_failed");

      const unknownError = createErrorParams(
        "login",
        "unknown",
        "login_failed"
      );
      expect(unknownError.error_code).toBe("unknown");
      expect(unknownError.error_message).toBe("login_failed");
    });
  });
});
