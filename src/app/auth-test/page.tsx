/**
 * Test page to demonstrate authentication cache functionality
 */

"use client";

import {
  isAuthenticated,
  getAuthCache,
  clearAuthCache,
} from "../helpers/authCache";
import { useState, useEffect } from "react";

export default function AuthTestPage() {
  const [authData, setAuthData] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const updateAuthStatus = () => {
      setIsAuth(isAuthenticated());
      setAuthData(getAuthCache());
    };

    updateAuthStatus();

    // Update every second to show real-time expiration
    const interval = setInterval(updateAuthStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearAuthCache();
    setIsAuth(false);
    setAuthData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Cache Test</h1>

        <div className="space-y-4">
          <div>
            <strong>Authentication Status:</strong>{" "}
            <span className={isAuth ? "text-green-600" : "text-red-600"}>
              {isAuth ? "Authenticated" : "Not Authenticated"}
            </span>
          </div>

          {authData && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Cached Auth Data:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(authData, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-x-4">
            <a
              href="/login?callback=http://localhost:3001/auth/callback"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login (Normal)
            </a>

            <a
              href="/login?callback=http://localhost:3001/auth/callback&force=true"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Login (Force - Bypass Cache)
            </a>

            <button
              onClick={handleClearCache}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear Cache
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">How to Test:</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>Click "Login (Normal)" to authenticate</li>
              <li>
                After successful login, click "Login (Normal)" again - you
                should be auto-redirected
              </li>
              <li>Use "Login (Force)" to bypass cache and force fresh login</li>
              <li>Use "Clear Cache" to manually clear stored authentication</li>
              <li>
                Watch the cache data expire automatically after the timeout
                period
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
