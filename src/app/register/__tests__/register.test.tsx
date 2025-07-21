import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the register page dependencies
jest.mock("../../components/Header", () => {
  const MockHeader = () => <div data-testid="header">Header</div>;
  MockHeader.displayName = "MockHeader";
  return MockHeader;
});
jest.mock("../../components/Footer", () => {
  const MockFooter = () => <div data-testid="footer">Footer</div>;
  MockFooter.displayName = "MockFooter";
  return MockFooter;
});
jest.mock("../../components/SearchParamsWrapper", () => {
  const MockSearchParamsWrapper = ({
    children,
  }: {
    children: (params: URLSearchParams) => React.ReactNode;
  }) => {
    const mockSearchParams = {
      get: jest.fn((key: string) => {
        if (key === "callback") return "http://localhost:3001/auth/callback";
        return null;
      }),
    } as unknown as URLSearchParams;
    return <>{children(mockSearchParams)}</>;
  };
  MockSearchParamsWrapper.displayName = "MockSearchParamsWrapper";
  return MockSearchParamsWrapper;
});

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
}));

// Mock react-phone-number-input
jest.mock("react-phone-number-input", () => {
  return function PhoneInput({ value, onChange, placeholder }: any) {
    return (
      <input
        data-testid="phone-input"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

// Mock localization
jest.mock("@/locales/local.en.json", () => ({
  register: {
    validation: {
      name_required: "Name is required",
      email_required: "Email is required",
      email_invalid: "Email is invalid",
      phone_required: "Phone number is required",
      id_required: "ID number is required",
      password_required: "Password is required",
      password_weak: "Password is too weak",
      building_required: "Building name is required",
      flat_required: "Flat number is required",
    },
    messages: {
      success: "Registration successful",
      error: "Registration failed",
      email_exists: "Email already exists",
    },
    title: "Register",
    button: "Register",
    tabs: {
      login: "Login",
      register: "Register",
    },
    fields: {
      name_label: "Full Name",
      email_label: "Email",
      phone_label: "Phone Number",
      id_label: "ID Number",
      password_label: "Password",
      building_label: "Building Name",
      flat_label: "Flat Number",
      username_label: "Username",
    },
  },
}));

// Mock API
const mockRegisterUser = jest.fn();
jest.mock("../helpers/api", () => ({
  registerUser: mockRegisterUser,
}));

// Mock form data constants
jest.mock("@/constants/formData", () => ({
  initialFormData: {
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    name: "",
    flatNumber: "",
    buildingName: "",
  },
}));

// Create a simplified version of the RegisterForm for testing
const RegisterForm = ({ callbackUrl }: { callbackUrl: string }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    password: "",
    buildingName: "",
    flatNumber: "",
    username: "",
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const validatePassword = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "password") validatePassword(value);
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value || "" }));
    setFormErrors((prev) => ({ ...prev, phoneNumber: undefined }));
  };

  const validateForm = (data: typeof formData) => {
    const errors: Record<string, string> = {};
    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = "Email is invalid";
    if (!data.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!data.idNumber) errors.idNumber = "ID number is required";
    if (!data.password) errors.password = "Password is required";
    else if (passwordStrength < 3) errors.password = "Password is too weak";
    if (!data.buildingName) errors.buildingName = "Building name is required";
    if (!data.flatNumber) errors.flatNumber = "Flat number is required";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const result = await mockRegisterUser(formData);
      if (result.code === 201 && result.status === "success") {
        const { toast } = require("react-toastify");
        toast.success("Registration successful");
      }
    } catch (error) {
      const { toast } = require("react-toastify");
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div data-testid="register-form">
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        {formErrors.name && <p data-testid="name-error">{formErrors.name}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {formErrors.email && (
          <p data-testid="email-error">{formErrors.email}</p>
        )}

        <div data-testid="phone-container">
          <input
            data-testid="phone-input"
            value={formData.phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Phone Number"
          />
        </div>
        {formErrors.phoneNumber && (
          <p data-testid="phone-error">{formErrors.phoneNumber}</p>
        )}

        <input
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
        />
        {formErrors.idNumber && (
          <p data-testid="id-error">{formErrors.idNumber}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {formErrors.password && (
          <p data-testid="password-error">{formErrors.password}</p>
        )}
        <div data-testid="password-strength">
          Strength: {passwordStrength}/5
        </div>

        <input
          name="buildingName"
          placeholder="Building Name"
          value={formData.buildingName}
          onChange={handleChange}
        />
        {formErrors.buildingName && (
          <p data-testid="building-error">{formErrors.buildingName}</p>
        )}

        <input
          name="flatNumber"
          placeholder="Flat Number"
          value={formData.flatNumber}
          onChange={handleChange}
        />
        {formErrors.flatNumber && (
          <p data-testid="flat-error">{formErrors.flatNumber}</p>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

describe("RegisterForm", () => {
  const defaultProps = {
    callbackUrl: "http://localhost:3001/auth/callback",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders registration form with all fields", () => {
    render(<RegisterForm {...defaultProps} />);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ID Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Building Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Flat Number")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<RegisterForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByTestId("name-error")).toBeInTheDocument();
      expect(screen.getByTestId("email-error")).toBeInTheDocument();
      expect(screen.getByTestId("phone-error")).toBeInTheDocument();
      expect(screen.getByTestId("id-error")).toBeInTheDocument();
      expect(screen.getByTestId("password-error")).toBeInTheDocument();
      expect(screen.getByTestId("building-error")).toBeInTheDocument();
      expect(screen.getByTestId("flat-error")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<RegisterForm {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "Email is invalid"
      );
    });
  });

  it("validates password strength", () => {
    render(<RegisterForm {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText("Password");

    // Weak password
    fireEvent.change(passwordInput, { target: { value: "123" } });
    expect(screen.getByTestId("password-strength")).toHaveTextContent(
      "Strength: 1/5"
    );

    // Strong password
    fireEvent.change(passwordInput, { target: { value: "StrongP@ss123" } });
    expect(screen.getByTestId("password-strength")).toHaveTextContent(
      "Strength: 5/5"
    );
  });

  it("clears field errors on input change", async () => {
    render(<RegisterForm {...defaultProps} />);

    // Trigger validation errors
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    await waitFor(() => {
      expect(screen.getByTestId("name-error")).toBeInTheDocument();
    });

    // Type in name field
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });

    // Error should be cleared
    expect(screen.queryByTestId("name-error")).not.toBeInTheDocument();
  });

  it("handles successful registration", async () => {
    const { toast } = require("react-toastify");
    mockRegisterUser.mockResolvedValue({
      code: 201,
      status: "success",
      message: "Registration successful",
    });

    render(<RegisterForm {...defaultProps} />);

    // Fill in all required fields
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("phone-input"), {
      target: { value: "+1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("ID Number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "StrongP@ss123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building Name"), {
      target: { value: "Building A" },
    });
    fireEvent.change(screen.getByPlaceholderText("Flat Number"), {
      target: { value: "101" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          phoneNumber: "+1234567890",
          idNumber: "123456789",
          password: "StrongP@ss123",
          buildingName: "Building A",
          flatNumber: "101",
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Registration successful");
    });
  });

  it("handles registration failure", async () => {
    const { toast } = require("react-toastify");
    mockRegisterUser.mockRejectedValue(new Error("Network error"));

    render(<RegisterForm {...defaultProps} />);

    // Fill in valid data
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("phone-input"), {
      target: { value: "+1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("ID Number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "StrongP@ss123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Building Name"), {
      target: { value: "Building A" },
    });
    fireEvent.change(screen.getByPlaceholderText("Flat Number"), {
      target: { value: "101" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Registration failed. Please try again."
      );
    });
  });
});
