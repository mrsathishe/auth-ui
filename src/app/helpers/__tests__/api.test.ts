import axios from "axios";
import { loginUser, registerUser } from "../api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("loginUser", () => {
    it("makes POST request to login endpoint with correct payload", async () => {
      const mockResponse = {
        data: {
          code: 200,
          status: "success",
          token: "mock-token",
          token_type: "bearer",
          expires_in: 1800,
        },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await loginUser("testuser", "password123");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8000/login",
        {
          identifier: "testuser",
          password: "password123",
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("uses production URL when NODE_ENV is production", async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      // Import the module after setting the environment
      jest.resetModules();
      const { loginUser } = require("../api");

      await loginUser("testuser", "password123");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8000/login",
        expect.any(Object)
      );

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it("uses environment variable when provided", async () => {
      const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = "https://custom-api.com";

      // Import the module after setting the environment
      jest.resetModules();
      const { loginUser } = require("../api");

      await loginUser("testuser", "password123");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://custom-api.com/login",
        expect.any(Object)
      );

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    });

    it("uses environment variable when provided", async () => {
      process.env.NEXT_PUBLIC_API_BASE_URL = "https://custom-api.com";

      mockedAxios.post.mockResolvedValue({ data: {} });

      await loginUser("testuser", "password123");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://custom-api.com/login",
        expect.any(Object)
      );
    });

    it("handles network errors", async () => {
      mockedAxios.post.mockRejectedValue(new Error("Network Error"));

      await expect(loginUser("testuser", "password123")).rejects.toThrow(
        "Network Error"
      );
    });
  });

  describe("registerUser", () => {
    it("makes POST request to register endpoint with mapped payload", async () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "+1234567890",
        password: "password123",
        buildingName: "Building A",
        flatNumber: "101",
      };

      const expectedPayload = {
        full_name: "John Doe",
        email: "john@example.com",
        phone_number: "+1234567890",
        password: "password123",
        building_name: "Building A",
        apartment_name: "101",
      };

      const mockResponse = {
        code: 201,
        status: "success",
        message: "Registration successful",
      };

      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await registerUser(formData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8000/register",
        expectedPayload
      );
      expect(result).toEqual(mockResponse);
    });

    it("handles registration errors", async () => {
      const formData = {
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "+1234567890",
        password: "password123",
        buildingName: "Building A",
        flatNumber: "101",
      };

      mockedAxios.post.mockRejectedValue(new Error("Registration failed"));

      await expect(registerUser(formData)).rejects.toThrow(
        "Registration failed"
      );
    });
  });
});
