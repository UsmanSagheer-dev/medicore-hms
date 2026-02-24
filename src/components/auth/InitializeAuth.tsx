"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe } from "@/redux/slices/authSlice";

export default function InitializeAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {

    if (!user && isAuthenticated) {
      const initializeUser = async () => {
        try {
          await dispatch(getMe());
        } catch (error) {
          console.log("Auth initialization failed:", error);
        }
      };

      initializeUser();
    }
  }, [dispatch, user, isAuthenticated]);

  return null;
}
