"use client";

import { useState, useEffect } from "react";
import {
  isAuthenticated,
  getAuthCache,
  getCacheRemainingTime,
  clearAuthCache,
} from "../helpers/authCache";

export function AuthStatus() {
  const [authState, setAuthState] = useState<{
    isAuth: boolean;
    username: string | null;
    remainingTime: number;
  }>({
    isAuth: false,
    username: null,
    remainingTime: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true when component is hydrated on client
    setMounted(true);

    const updateAuthState = () => {
      if (isAuthenticated()) {
        const cache = getAuthCache();
        setAuthState({
          isAuth: true,
          username: cache?.username || null,
          remainingTime: getCacheRemainingTime(),
        });
      } else {
        setAuthState({
          isAuth: false,
          username: null,
          remainingTime: 0,
        });
      }
    };

    // Initial check
    updateAuthState();

    // Update every 30 seconds to keep timer accurate
    const interval = setInterval(updateAuthState, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearAuthCache();
    setAuthState({
      isAuth: false,
      username: null,
      remainingTime: 0,
    });
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Don't render anything until component is mounted (prevents hydration mismatch)
  if (!mounted) {
    return <div style={{ height: "40px" }} />; // Placeholder to prevent layout shift
  }

  if (!authState.isAuth) {
    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "#f3f4f6",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "14px",
          color: "#6b7280",
          zIndex: 1000,
        }}
      >
        Not authenticated
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#dcfce7",
        border: "1px solid #16a34a",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "14px",
        color: "#15803d",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span>✓ {authState.username}</span>
      <span style={{ color: "#65a30d" }}>
        ({formatTime(authState.remainingTime)} left)
      </span>
      <button
        onClick={handleLogout}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
