import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthStatus, logout } from "../AuthStatus";

// Mock auth cache functions
const mockIsAuthenticated = jest.fn();
const mockGetAuthCache = jest.fn();
const mockGetCacheRemainingTime = jest.fn();
const mockClearAuthCache = jest.fn();

jest.mock("../../helpers/authCache", () => ({
  isAuthenticated: mockIsAuthenticated,
  getAuthCache: mockGetAuthCache,
  getCacheRemainingTime: mockGetCacheRemainingTime,
  clearAuthCache: mockClearAuthCache,
}));

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: {
    reload: jest.fn(),
  },
  writable: true,
});

describe("AuthStatus Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when user is not authenticated", () => {
    mockIsAuthenticated.mockReturnValue(false);

    const { container } = render(<AuthStatus />);

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when auth data is null", () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetAuthCache.mockReturnValue(null);

    const { container } = render(<AuthStatus />);

    expect(container.firstChild).toBeNull();
  });

  it("renders auth status when user is authenticated", () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetAuthCache.mockReturnValue({
      token: "test-token",
      token_type: "bearer",
      expires_in: 1800,
      timestamp: Date.now(),
      username: "testuser@example.com",
    });
    mockGetCacheRemainingTime.mockReturnValue(900); // 15 minutes

    render(<AuthStatus />);

    expect(
      screen.getByText("Already logged in as: testuser@example.com")
    ).toBeInTheDocument();
    expect(screen.getByText("Expires in: 15m 0s")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("displays correct time format for various remaining times", () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetAuthCache.mockReturnValue({
      token: "test-token",
      token_type: "bearer",
      expires_in: 1800,
      timestamp: Date.now(),
      username: "testuser@example.com",
    });

    // Test different remaining times
    const testCases = [
      { remainingTime: 3661, expected: "Expires in: 61m 1s" },
      { remainingTime: 125, expected: "Expires in: 2m 5s" },
      { remainingTime: 45, expected: "Expires in: 0m 45s" },
      { remainingTime: 0, expected: "Expires in: 0m 0s" },
    ];

    testCases.forEach(({ remainingTime, expected }) => {
      mockGetCacheRemainingTime.mockReturnValue(remainingTime);

      const { rerender } = render(<AuthStatus />);

      expect(screen.getByText(expected)).toBeInTheDocument();

      rerender(<div />); // Clear previous render
    });
  });

  it("calls logout function when logout button is clicked", () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockGetAuthCache.mockReturnValue({
      token: "test-token",
      token_type: "bearer",
      expires_in: 1800,
      timestamp: Date.now(),
      username: "testuser@example.com",
    });
    mockGetCacheRemainingTime.mockReturnValue(900);

    render(<AuthStatus />);

    const logoutButton = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(logoutButton);

    expect(mockClearAuthCache).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });
});

describe("logout function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("clears auth cache and reloads page", () => {
    logout();

    expect(mockClearAuthCache).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });
});
