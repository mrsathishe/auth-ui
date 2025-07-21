import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "../page";

// Mock dependencies
jest.mock("../../components/Header", () => {
  const MockHeader = () => <div>Header</div>;
  MockHeader.displayName = "MockHeader";
  return MockHeader;
});
jest.mock("../../components/Footer", () => {
  const MockFooter = () => <div>Footer</div>;
  MockFooter.displayName = "MockFooter";
  return MockFooter;
});
jest.mock("../../components/AuthStatus", () => ({
  AuthStatus: () => <div>AuthStatus</div>,
}));
jest.mock("../helpers/api", () => ({
  loginUser: jest.fn((username, password) => {
    if (username === "valid" && password === "valid") {
      return Promise.resolve({
        data: {
          code: 200,
          status: "success",
          message: "Login successful",
          token: "mocktoken",
          token_type: "bearer",
          expires_in: 1800,
        },
      });
    }
    return Promise.resolve({
      data: {
        code: 401,
        status: "error",
        message: "Invalid credentials",
      },
    });
  }),
}));
jest.mock("../helpers/authCache", () => ({
  storeAuthCache: jest.fn(),
  getAuthCache: jest.fn(() => null),
  isAuthenticated: jest.fn(() => false),
}));

// Helper to render LoginForm with props
const renderLoginForm = (props = {}) => {
  return render(
    <LoginForm callbackUrl="http://localhost/callback" {...props} />
  );
};

describe("LoginForm", () => {
  it("renders login form fields", () => {
    renderLoginForm();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors if fields are empty", async () => {
    renderLoginForm();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(
      await screen.findByText(/username is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it("calls loginUser and redirects on success", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "valid" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "valid" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it("shows error toast on invalid credentials", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "invalid" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("auto-redirects if already authenticated (cache)", async () => {
    const { getAuthCache, isAuthenticated } = require("../helpers/authCache");
    isAuthenticated.mockReturnValue(true);
    getAuthCache.mockReturnValue({
      token: "cachedtoken",
      token_type: "bearer",
      expires_in: 1800,
      timestamp: Date.now(),
      username: "cacheduser",
    });
    renderLoginForm();
    await waitFor(() => {
      expect(screen.getByText(/already logged in/i)).toBeInTheDocument();
    });
  });
});
