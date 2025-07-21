import {
  storeAuthCache,
  getAuthCache,
  isAuthenticated,
  clearAuthCache,
  getCacheRemainingTime,
  AuthCacheData,
} from "../authCache";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock Date.now
const mockDateNow = jest.fn();
Date.now = mockDateNow;

describe("Auth Cache Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDateNow.mockReturnValue(1642780800000); // Fixed timestamp
  });

  describe("storeAuthCache", () => {
    it("stores auth data in localStorage with correct structure", () => {
      const authData = {
        token: "test-token",
        token_type: "bearer",
        expires_in: 1800,
        username: "testuser",
      };

      storeAuthCache(authData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "auth_cache",
        JSON.stringify({
          token: "test-token",
          token_type: "bearer",
          expires_in: 1800,
          timestamp: 1642780800000,
          username: "testuser",
        })
      );
    });

    it("uses default values for optional fields", () => {
      const authData = {
        token: "test-token",
        username: "testuser",
      };

      storeAuthCache(authData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "auth_cache",
        JSON.stringify({
          token: "test-token",
          token_type: "bearer",
          expires_in: 1800,
          timestamp: 1642780800000,
          username: "testuser",
        })
      );
    });

    it("handles localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const authData = {
        token: "test-token",
        username: "testuser",
      };

      expect(() => storeAuthCache(authData)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to store auth cache:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getAuthCache", () => {
    it("returns cached auth data when valid", () => {
      const cachedData: AuthCacheData = {
        token: "cached-token",
        token_type: "bearer",
        expires_in: 1800,
        timestamp: 1642780800000,
        username: "cacheduser",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockDateNow.mockReturnValue(1642780800000 + 900000); // 15 minutes later

      const result = getAuthCache();

      expect(result).toEqual(cachedData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("auth_cache");
    });

    it("returns null when no cache exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getAuthCache();

      expect(result).toBeNull();
    });

    it("clears cache and returns null when expired", () => {
      const cachedData: AuthCacheData = {
        token: "expired-token",
        token_type: "bearer",
        expires_in: 1800,
        timestamp: 1642780800000,
        username: "expireduser",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockDateNow.mockReturnValue(1642780800000 + 2000000); // Over 30 minutes later

      const result = getAuthCache();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_cache");
    });

    it("handles corrupted cache data gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid-json");
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const result = getAuthCache();

      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_cache");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to retrieve auth cache:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when valid cache exists", () => {
      const cachedData: AuthCacheData = {
        token: "valid-token",
        token_type: "bearer",
        expires_in: 1800,
        timestamp: 1642780800000,
        username: "validuser",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockDateNow.mockReturnValue(1642780800000 + 900000); // 15 minutes later

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it("returns false when no cache exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it("returns false when cache is expired", () => {
      const cachedData: AuthCacheData = {
        token: "expired-token",
        token_type: "bearer",
        expires_in: 1800,
        timestamp: 1642780800000,
        username: "expireduser",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockDateNow.mockReturnValue(1642780800000 + 2000000); // Over 30 minutes later

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe("clearAuthCache", () => {
    it("removes auth data from localStorage", () => {
      clearAuthCache();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_cache");
    });

    it("handles localStorage errors gracefully", () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error("Could not access localStorage");
      });

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      expect(() => clearAuthCache()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to clear auth cache:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getCacheRemainingTime", () => {
    it("returns remaining time in seconds for valid cache", () => {
      const cachedData: AuthCacheData = {
        token: "valid-token",
        token_type: "bearer",
        expires_in: 1800,
        timestamp: 1642780800000,
        username: "validuser",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockDateNow.mockReturnValue(1642780800000 + 900000); // 15 minutes later

      const result = getCacheRemainingTime();

      expect(result).toBe(900); // 15 minutes remaining
    });

    it("returns 0 when no cache exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getCacheRemainingTime();

      expect(result).toBe(0);
    });

    it("returns 0 when cache is expired", () => {
      const cachedData: AuthCacheData = {
        token: "expired-token",
        token_type: "bearer",
        expires_in: 1800,
        timestamp: 1642780800000,
        username: "expireduser",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
      mockDateNow.mockReturnValue(1642780800000 + 2000000); // Over 30 minutes later

      const result = getCacheRemainingTime();

      expect(result).toBe(0);
    });
  });
});
