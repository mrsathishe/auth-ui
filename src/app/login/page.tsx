"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../style.scss";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { username?: string; password?: string } = {};
    if (!formData.username) errors.username = "Username/Email is required";
    if (!formData.password) errors.password = "Password is required";
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      console.log("Login Data Submitted:", formData);
      alert("Login Successful!");
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
              Login
            </a>
            <a
              href="/register"
              className="px-6 py-2 transition-colors text-center w-32 font-semibold"
              style={{
                background: "white",
                color: "#2563eb",
              }}
            >
              Register
            </a>
          </div>
        </div>
        <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Login to your account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                Username/Email
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
                Password
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
