"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe, logout } from "@/redux/slices/authSlice";

export default function InitializeAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    // Only attempt once to prevent infinite loops
    if (hasAttemptedAuth.current) return;

    // Only try to fetch user if we have a token but no user data
    if (token && !user) {
      hasAttemptedAuth.current = true;
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
    }
  }, [token, user, dispatch]);

  return null;
}
