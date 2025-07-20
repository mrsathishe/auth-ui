"use client";

import { useState } from "react";
// import Image from "next/image";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import en from "@/locales/local.en.json";
import { loginUser } from "../helpers/api";
// import { showAlert } from "../helpers/api";
import Footer from "../components/Footer";
import "../style.scss";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  type FormErrors = { username?: string; password?: string };
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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
          } else if (result.code === 401 && result.status === "error") {
            toast.error(result.message || "Invalid credentials");
          } else {
            toast.error("Login failed. Please try again.");
          }
        })
        .catch(() => {
          toast.error("Login failed. Please try again.");
        });
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
