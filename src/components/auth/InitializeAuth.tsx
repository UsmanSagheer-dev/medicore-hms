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
    // Only attempt once to prevent infinite loops
    if (hasAttemptedAuth.current) return;

    if (!user && isAuthenticated) {
      hasAttemptedAuth.current = true;
      const initializeUser = async () => {
        try {
          const result = await dispatch(getMe()).unwrap();
          if (!result) {
            // If no user data returned, logout
            dispatch(logout());
          }
        } catch (error) {
          console.log("Auth initialization failed - token likely expired");
          // Dispatch logout to clear stale state
          dispatch(logout());
        }
      };

      initializeUser();
    }
  }, [dispatch, user, isAuthenticated]);

  return null;
}
