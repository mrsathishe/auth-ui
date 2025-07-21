"use client";

import { useState, useEffect } from "react";
// import Image from "next/image";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import en from "@/locales/local.en.json";
import { loginUser } from "../helpers/api";
import {
  storeAuthCache,
  getAuthCache,
  isAuthenticated,
} from "../helpers/authCache";
// import { showAlert } from "../helpers/api";
import Footer from "../components/Footer";
import SearchParamsWrapper from "../components/SearchParamsWrapper";
import { AuthStatus } from "../components/AuthStatus";
import "../style.scss";

interface LoginFormProps {
  callbackUrl: string;
  forceLogin?: boolean;
}

function LoginForm({ callbackUrl, forceLogin = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  type FormErrors = { username?: string; password?: string };
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Check for existing authentication on component mount
  useEffect(() => {
    // Skip cache check if force login is requested
    if (forceLogin) return;

    if (isAuthenticated()) {
      const cachedAuth = getAuthCache();
      if (cachedAuth) {
        toast.success("Already logged in, redirecting...");
        setTimeout(() => {
          // Create callback URL with cached auth data
          const url = new URL(callbackUrl);
          url.searchParams.set("auth_status", "success");
          url.searchParams.set("auth_method", "login");
          url.searchParams.set("timestamp", Date.now().toString());
          url.searchParams.set("token", cachedAuth.token);
          url.searchParams.set("token_type", cachedAuth.token_type);
          url.searchParams.set("expires_in", cachedAuth.expires_in.toString());
          url.searchParams.set("from_cache", "true"); // Indicate this was from cache

          window.location.href = url.toString();
        }, 1000);
        return;
      }
    }
  }, [callbackUrl, forceLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { username?: string; password?: string } = {};
    if (!formData.username)
      errors.username = en.login.validation.username_required;
    if (!formData.password)
      errors.password = en.login.validation.password_required;
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      // Connect to backend API for login
      loginUser(formData.username, formData.password)
        .then((response) => {
          const result = response.data;
          if (result.code === 200 && result.status === "success") {
            toast.success(result.message || en.login.messages.success);

            // Store authentication data in cache
            if (result.token) {
              storeAuthCache({
                token: result.token,
                token_type: result.token_type || "bearer",
                expires_in: result.expires_in || 1800,
                username: formData.username,
              });
            }

            setTimeout(() => {
              // Add success parameters to the callback URL
              const url = new URL(callbackUrl);
              url.searchParams.set("auth_status", "success");
              url.searchParams.set("auth_method", "login");
              url.searchParams.set("timestamp", Date.now().toString());

              // Add token information to callback URL
              if (result.token) {
                url.searchParams.set("token", result.token);
              }
              if (result.token_type) {
                url.searchParams.set("token_type", result.token_type);
              }
              if (result.expires_in) {
                url.searchParams.set(
                  "expires_in",
                  result.expires_in.toString()
                );
              }

              window.location.href = url.toString();
            }, 1200);
          } else if (result.code === 401 && result.status === "error") {
            toast.error(result.message || "Invalid credentials");
            // Optional: redirect with error status after some delay
            setTimeout(() => {
              if (callbackUrl !== "/") {
                const url = new URL(callbackUrl);
                url.searchParams.set("auth_status", "error");
                url.searchParams.set("auth_method", "login");
                url.searchParams.set("error_code", "401");
                url.searchParams.set("error_message", "invalid_credentials");
                url.searchParams.set("timestamp", Date.now().toString());
                // Uncomment the next line if you want to redirect on error
                // window.location.href = url.toString();
              }
            }, 3000);
          } else {
            toast.error("Login failed. Please try again.");
            setTimeout(() => {
              if (callbackUrl !== "/") {
                const url = new URL(callbackUrl);
                url.searchParams.set("auth_status", "error");
                url.searchParams.set("auth_method", "login");
                url.searchParams.set("error_code", "unknown");
                url.searchParams.set("error_message", "login_failed");
                url.searchParams.set("timestamp", Date.now().toString());
                // Uncomment the next line if you want to redirect on error
                // window.location.href = url.toString();
              }
            }, 3000);
          }
        })
        .catch(() => {
          toast.error("Login failed. Please try again.");
          setTimeout(() => {
            if (callbackUrl !== "/") {
              const url = new URL(callbackUrl);
              url.searchParams.set("auth_status", "error");
              url.searchParams.set("auth_method", "login");
              url.searchParams.set("error_code", "network");
              url.searchParams.set("error_message", "connection_failed");
              url.searchParams.set("timestamp", Date.now().toString());
              // Uncomment the next line if you want to redirect on error
              // window.location.href = url.toString();
            }
          }, 3000);
        });
    }
  };

  return (
    <>
      <AuthStatus />
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        {/* Tabs at the top center */}
        <div className="flex justify-center mb-8 w-full">
          <div className="border border-gray-300 rounded-full overflow-hidden flex text-sm bg-gray-100">
            <a
              href="/login"
              className="px-6 py-2 transition-colors text-center w-32 font-semibold"
              style={{
                background: "#2563eb",
                color: "white",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              {en.login.tabs.login}
            </a>
            <a
              href="/register"
              className="px-6 py-2 transition-colors text-center w-32 font-semibold"
              style={{
                background: "white",
                color: "#2563eb",
              }}
            >
              {en.login.tabs.register}
            </a>
          </div>
        </div>
        <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            {en.login.title}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                {en.login.fields.username_label}
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
              <label className="block text-gray-700 text-sm mb-1">
                {en.login.fields.password_label}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-blue-600 rounded-md"
              />
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-48 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg transition-colors hover:bg-blue-700"
              >
                {en.login.button}
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

export default function LoginPage() {
  return (
    <SearchParamsWrapper>
      {(searchParams) => {
        const callbackUrl = searchParams.get("callback") || "/";
        const forceLogin = searchParams.get("force") === "true";
        return <LoginForm callbackUrl={callbackUrl} forceLogin={forceLogin} />;
      }}
    </SearchParamsWrapper>
  );
}
