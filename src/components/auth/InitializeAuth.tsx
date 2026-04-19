"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe, logout } from "@/redux/slices/authSlice";

export default function InitializeAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    // Only attempt once to prevent infinite loops
    if (hasAttemptedAuth.current) return;

    // Don't try to fetch user if already authenticated
    if (isAuthenticated && user) {
      console.log("✅ Already authenticated, skipping getMe()");
      return;
    }

    // Check localStorage for token on app init
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      
      console.log("🔍 InitializeAuth check:", { storedToken: !!storedToken, storedUser: !!storedUser, isAuthenticated, user: !!user });
      
      // If we have a stored token but no user data, fetch it
      if (storedToken && !user) {
        hasAttemptedAuth.current = true;
        console.log("📡 Calling getMe() to fetch user data");
        const initializeUser = async () => {
          try {
            const result = await dispatch(getMe()).unwrap();
            if (!result) {
              dispatch(logout());
            }
          } catch (error) {
            console.log("Auth initialization failed - token likely expired");
            dispatch(logout());
          }
        };

        initializeUser();
      } else if (storedUser && !user) {
        // If we have user data but token is missing, try getMe
        hasAttemptedAuth.current = true;
        console.log("📡 Calling getMe() to sync user data");
        const initializeUser = async () => {
          try {
            const result = await dispatch(getMe()).unwrap();
            if (!result) {
              dispatch(logout());
            }
          } catch (error) {
            console.log("Auth initialization failed");
            dispatch(logout());
          }
        };
        initializeUser();
      }
    }
  }, [isAuthenticated, user, dispatch]);

  return null;
}
