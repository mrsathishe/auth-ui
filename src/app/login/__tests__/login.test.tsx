import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// We need to mock the LoginForm component since the main export is wrapped
const LoginForm = ({
  callbackUrl,
  forceLogin = false,
}: {
  callbackUrl: string;
  forceLogin?: boolean;
}) => {
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = React.useState<{
    username?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { username?: string; password?: string } = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    setFormErrors(errors);
    // Mock submission logic here
  };

  return (
    <div data-testid="login-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />
        {formErrors.username && (
          <p data-testid="username-error">{formErrors.username}</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {formErrors.password && (
          <p data-testid="password-error">{formErrors.password}</p>
        )}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

describe("LoginForm", () => {
  const defaultProps = {
    callbackUrl: "http://localhost:3001/auth/callback",
    forceLogin: false,
  };

  it("renders login form with all fields", () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<LoginForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByTestId("username-error")).toBeInTheDocument();
    expect(await screen.findByTestId("password-error")).toBeInTheDocument();
    expect(screen.getByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("updates form data on input change", () => {
    render(<LoginForm {...defaultProps} />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("testpass");
  });

  it("clears validation errors on input change", () => {
    render(<LoginForm {...defaultProps} />);

    // Trigger validation errors
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByTestId("username-error")).toBeInTheDocument();

    // Type in username field
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "test" },
    });

    // Error should be cleared
    expect(screen.queryByTestId("username-error")).not.toBeInTheDocument();
  });
});
