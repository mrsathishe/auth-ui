/**
 * Logout component and utilities
 */

import {
  clearAuthCache,
  isAuthenticated,
  getAuthCache,
  getCacheRemainingTime,
} from "../helpers/authCache";

export function logout(): void {
  clearAuthCache();
  // Optionally reload the page or redirect
  window.location.reload();
}

export function AuthStatus(): JSX.Element | null {
  if (!isAuthenticated()) return null;

  const authData = getAuthCache();
  const remainingTime = getCacheRemainingTime();

  if (!authData) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">
            Already logged in as: {authData.username}
          </p>
          <p className="text-sm">
            Expires in: {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
          </p>
        </div>
        <button
          onClick={logout}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
