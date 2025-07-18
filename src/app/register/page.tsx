"use client";

import { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../style.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { FormData, initialFormData } from "@/constants/formData";

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prevData) => ({ ...prevData, phoneNumber: value || "" }));
  };
  const SERVICE_URL = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://your-production-url.com";

  // Password strength and validation
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordNote, setPasswordNote] = useState("");

  function validatePassword(password: string) {
    let strength = 0;
    let note = "";
    if (password.length >= 8) strength++;
    else note = "Password must be at least 8 characters.";
    if (/[a-z]/.test(password)) strength++;
    else note = "Password must contain a lowercase letter.";
    if (/[A-Z]/.test(password)) strength++;
    else note = "Password must contain an uppercase letter.";
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else note = "Password must contain a symbol.";
    if (/[0-9]/.test(password)) strength++;
    else note = "Password must contain a number.";
    setPasswordStrength(strength);
    setPasswordNote(note);
    return strength === 5;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    else if (!validatePassword(formData.password)) errors.password = passwordNote || "Password does not meet requirements.";
    if (!formData.email) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Enter a valid email address.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone Number is required";
    if (!formData.idNumber) errors.idNumber = "ID Number is required";
    if (!formData.name) errors.name = "Name is required";
    if (!formData.flatNumber) errors.flatNumber = "Flat Number is required";
    if (!formData.buildingName)
      errors.buildingName = "Building Name is required";
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(`${SERVICE_URL}/register`, formData);
        if (response.status === 200) {
          alert("Registration Successful!");
        } else {
          alert("Registration failed. Please try again.");
        }
      } catch (error: any) {
        alert(error?.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        {/* Tabs at the top center */}
        <div className="flex justify-center mb-8 w-full">
          <div className="border border-gray-300 rounded-full overflow-hidden flex text-sm bg-gray-100">
            <a
              href="/login"
              className="px-6 py-2 transition-colors text-center w-32 font-semibold"
              style={{
                background: "white",
                color: "#2563eb",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              Login
            </a>
            <a
              href="/register"
              className="px-6 py-2 transition-colors text-center w-32 font-semibold"
              style={{
                background: "#2563eb",
                color: "white",
              }}
            >
              Register
            </a>
          </div>
        </div>
        <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Create an account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            {/* Full Name at the top */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-blue-600 rounded-md"
              />
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-blue-600 rounded-md"
              />
              {formErrors.username && (
                <p className="text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-md ${formErrors.email ? 'border-red-600' : 'border-blue-600'}`}
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={e => { handleChange(e); validatePassword(e.target.value); }}
                className={`w-full px-4 py-2 border-2 rounded-md ${formErrors.password ? 'border-red-600' : 'border-blue-600'}`}
              />
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-1">
                <div
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  className={`h-2 rounded-full ${passwordStrength <= 2 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-yellow-500' : passwordStrength === 4 ? 'bg-blue-500' : 'bg-green-500'}`}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Password must be at least 8 characters, contain one lowercase, one uppercase, one symbol, and one number.</p>
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            {/* Phone Number Input with Country Selector - Styled via globals.css */}
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Phone Number
              </label>
              <PhoneInput
                international
                defaultCountry="IN"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className="phoneInputContainer"
                maxLength={15}
              />
              {formErrors.phoneNumber && (
                <p className="text-sm text-red-600">{formErrors.phoneNumber}</p>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-md ${formErrors.username ? 'border-red-600' : 'border-blue-600'}`}
              />
              {formErrors.username && (
                <p className="text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>
                  Select a flat number
                </option>
                <optgroup label="Ground Floor">
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                </optgroup>
                <optgroup label="First Floor">
                  <option value="F1">F1</option>
                  <option value="F2">F2</option>
                  <option value="F3">F3</option>
                </optgroup>
                <optgroup label="Second Floor">
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                </optgroup>
              </select>
              {formErrors.flatNumber && (
                <p className="text-sm text-red-600">{formErrors.flatNumber}</p>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-md ${formErrors.name ? 'border-red-600' : 'border-blue-600'}`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
                </option>
                <option value="mp_milan">MP Milan</option>
                <option value="mp_livit">MP Livit</option>
              </select>
              {formErrors.buildingName && (
                <p className="text-sm text-red-600">
                  {formErrors.buildingName}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-48 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg transition-colors hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
