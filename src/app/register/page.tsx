"use client";

import { useState } from "react";
// import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../style.scss";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchParamsWrapper from "../components/SearchParamsWrapper";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormData, initialFormData } from "@/constants/formData";
import { registerUser } from "../helpers/api";
import en from "@/locales/local.en.json";
// import { NotificationContainer } from "react-notifications";

type FormErrors = Partial<Record<keyof FormData, string>>;

interface RegisterFormProps {
  callbackUrl: string;
}

function RegisterForm({ callbackUrl }: RegisterFormProps) {
  // State and handlers for the registration form
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  function validatePassword(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "password") validatePassword(value);
  }

  function handlePhoneChange(value: string | undefined) {
    setFormData((prev) => ({ ...prev, phoneNumber: value || "" }));
    setFormErrors((prev) => ({ ...prev, phoneNumber: undefined }));
  }

  function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.name.trim())
      errors.name = en.register.validation.full_name_required;
    if (!data.username.trim())
      errors.username = en.register.validation.username_required;
    if (!data.email.trim())
      errors.email = en.register.validation.email_required;
    else if (!/^\S+@\S+\.\S+$/.test(data.email))
      errors.email = en.register.validation.email_invalid;
    if (!data.password)
      errors.password = en.register.validation.password_required;
    else {
      if (data.password.length < 8)
        errors.password = en.register.validation.password_length;
      else if (!/[a-z]/.test(data.password))
        errors.password = en.register.validation.password_lower;
      else if (!/[A-Z]/.test(data.password))
        errors.password = en.register.validation.password_upper;
      else if (!/\d/.test(data.password))
        errors.password = en.register.validation.password_number;
      else if (!/[^A-Za-z0-9]/.test(data.password))
        errors.password = en.register.validation.password_symbol;
    }
    if (!data.phoneNumber)
      errors.phoneNumber = en.register.validation.phone_required;
    if (!data.flatNumber)
      errors.flatNumber = en.register.validation.flat_required;
    if (!data.buildingName)
      errors.buildingName = en.register.validation.building_required;
    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const result = await registerUser(formData);
      if (result.code === 201 && result.status === "success") {
        toast.success(result.message || en.register.messages.success);
        setFormData(initialFormData);
        setPasswordStrength(0);
        setTimeout(() => {
          // Add success parameters to the callback URL
          const url = new URL(callbackUrl);
          url.searchParams.set("auth_status", "success");
          url.searchParams.set("auth_method", "register");
          url.searchParams.set("timestamp", Date.now().toString());
          if (result.user) {
            url.searchParams.set("user_id", result.user.id || "");
            url.searchParams.set(
              "username",
              result.user.username || formData.email
            );
          }
          window.location.href = url.toString();
        }, 1200);
      } else if (result.code === 409 && result.status === "error") {
        toast.error(result.message || en.register.messages.email_exists);
      } else {
        toast.error(en.register.messages.error);
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
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
              {en.register.tabs.login}
            </a>
            <a
              href="/register"
              className="px-6 py-2 transition-colors text-center w-32 font-semibold"
              style={{
                background: "#2563eb",
                color: "white",
              }}
            >
              {en.register.tabs.register}
            </a>
          </div>
        </div>
        <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            {en.register.title}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.full_name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-md ${
                  formErrors.name ? "border-red-600" : "border-blue-600"
                }`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
              {/* NotificationContainer removed, ToastContainer added below */}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.username}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-md ${
                  formErrors.username ? "border-red-600" : "border-blue-600"
                }`}
              />
              {formErrors.username && (
                <p className="text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-md ${
                  formErrors.email ? "border-red-600" : "border-blue-600"
                }`}
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.password}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  validatePassword(e.target.value);
                }}
                className={`w-full px-4 py-2 border-2 rounded-md ${
                  formErrors.password ? "border-red-600" : "border-blue-600"
                }`}
              />
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-1">
                <div
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  className={`h-2 rounded-full ${
                    passwordStrength <= 2
                      ? "bg-red-500"
                      : passwordStrength === 3
                      ? "bg-yellow-500"
                      : passwordStrength === 4
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {en.register.password_note}
              </p>
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.phone_number}
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
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.flat_number}
              </label>
              <select
                name="flatNumber"
                value={formData.flatNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-blue-600 rounded-md"
              >
                <option value="" disabled>
                  {en.register.fields.flat_number_select}
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
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.register.fields.building_name}
              </label>
              <select
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-blue-600 rounded-md"
              >
                <option value="" disabled>
                  {en.register.fields.building_select}
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
                {en.register.button}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </>
  );
}

export default function RegisterPage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => {
        const callbackUrl = searchParams.get("callback") || "/";
        return <RegisterForm callbackUrl={callbackUrl} />;
      }}
    </SearchParamsWrapper>
  );
}
