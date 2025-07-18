"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
export default function AdminPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12 w-full max-w-lg">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Admin Dashboard
          </h2>
          <p className="text-gray-700 text-lg">Welcome, Admin! This is your dashboard.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
