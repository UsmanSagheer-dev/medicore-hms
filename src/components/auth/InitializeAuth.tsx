"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe, logout } from "@/redux/slices/authSlice";

export default function InitializeAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    if (hasAttemptedAuth.current) return;
    hasAttemptedAuth.current = true;

    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    // ✅ Agar koi bhi session hai — HAMESHA getMe() call karo fresh data ke liye
    if (storedToken || storedUser || isAuthenticated || user) {
      console.log("📡 Fetching fresh user data from server...");
      const initializeUser = async () => {
        try {
          const result = await dispatch(getMe()).unwrap();
          if (!result) {
            dispatch(logout());
          }
        } catch (error) {
          console.log("Auth initialization failed - logging out");
          dispatch(logout());
        }
      };
      initializeUser();
    }
  }, []); 

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user" && isAuthenticated) {
        dispatch(getMe());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [isAuthenticated, dispatch]);

  return null;
}