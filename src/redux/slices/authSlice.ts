import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { updateDoctorProfile } from "./doctorSlice";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  justRegistered: boolean;
}

const getInitialUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialUser(),
  loading: false,
  error: null,
  justRegistered: false,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

const clearCookies = () => {
  const options = [
    "token",
    "userRole",
    "doctorId",
    "receptionistId",
    "authToken",
  ];
  options.forEach((name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`;
  });
};

const setUserCookies = (userData: any) => {
  if (!userData) return;

  if (userData.role) {
    const role = userData.role.toLowerCase();
    // Try multiple cookie settings in case some don't work
    document.cookie = `userRole=${role}; path=/; max-age=604800`;
    document.cookie = `userRole=${role}; path=/; max-age=604800; SameSite=Lax`;
  }

  const doctorId = userData.doctor?.id || userData.doctorId;
  if (doctorId) {
    document.cookie = `doctorId=${doctorId}; path=/; max-age=604800`;
    document.cookie = `doctorId=${doctorId}; path=/; max-age=604800; SameSite=Lax`;
  }

  const receptionistId = userData.receptionist?.id || userData.receptionistId;
  if (receptionistId) {
    document.cookie = `receptionistId=${receptionistId}; path=/; max-age=604800`;
    document.cookie = `receptionistId=${receptionistId}; path=/; max-age=604800; SameSite=Lax`;
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      state.token = null;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.justRegistered = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        clearCookies();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearJustRegistered: (state) => {
      // ✅ نیا reducer
      state.justRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.justRegistered = true;
        const userData = action.payload.user || action.payload;
        const token = action.payload.token || action.payload.authToken;
        state.user = userData;
        state.token = token;
        if (typeof window !== "undefined" && userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          if (token) {
            localStorage.setItem("authToken", token);
            document.cookie = `authToken=${token}; path=/; max-age=604800; SameSite=Lax`;
          }
          setUserCookies(userData);
        }
        console.log("Full payload:", action.payload);
        console.log("Cookies after register:", document.cookie);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.justRegistered = false;
        const userData = action.payload.user || action.payload;
        const token = action.payload.token || action.payload.authToken;
        state.user = userData;
        state.token = token;
        if (typeof window !== "undefined" && userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          if (token) {
            localStorage.setItem("authToken", token);

            const cookieValue = `authToken=${token}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = cookieValue;
          }
          setUserCookies(userData);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.justRegistered = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          clearCookies();
        }
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.justRegistered = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          clearCookies();
        }
      })

      // GetMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        const userData =
          action.payload.user || action.payload.data || action.payload;
        const token = action.payload.token || action.payload.authToken;
        state.user = userData;
        state.isAuthenticated = !!userData;
        if (token) {
          state.token = token;
        }
        if (typeof window !== "undefined" && userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          if (token) {
            localStorage.setItem("authToken", token);
          }
          setUserCookies(userData);
        }
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          clearCookies();
        }
      })
      // Auto-sync when doctor profile updates
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        if (state.user) {
          const updatedData =
            action.payload.doctor || action.payload.data || action.payload;
          state.user.doctor = {
            ...state.user.doctor,
            ...updatedData,
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(state.user));
          }
        }
      });
  },
});

export const { setCredentials, logout, clearError, clearJustRegistered } =
  authSlice.actions;

export default authSlice.reducer;
