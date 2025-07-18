"use client";

export default function UserPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12 w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">User Dashboard</h1>
        <p className="text-gray-700 text-lg">Welcome, User! This is your dashboard.</p>
      </div>
    </div>
  );
}
