import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  loading: false,
  error: null,
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      console.log('Registering with:', userData);
      const response = await api.post('/auth/register', userData);
      return response.data; // { user, token, success }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const loginUser =createAsyncThunk(
  'auth/loginUser',
  async(userData:any , {rejectWithValue})=>{
    try{
      const response = await api.post('/auth/login', userData);
      return response.data;  
    }catch(error:any){
      return rejectWithValue(error.response?.data?.error || error.message)
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined' && action.payload.token) {
          localStorage.setItem('token', action.payload.token);
          // Set cookies for middleware access
          document.cookie = `token=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
          if (action.payload.user?.role) {
            document.cookie = `userRole=${action.payload.user.role.toLowerCase()}; path=/; max-age=86400; SameSite=Lax`;
          }
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined' && action.payload.token) {
          localStorage.setItem('token', action.payload.token);
          // Set cookies for middleware access
          document.cookie = `token=${action.payload.token}; path=/; max-age=86400; SameSite=Lax`;
          if (action.payload.user?.role) {
            document.cookie = `userRole=${action.payload.user.role.toLowerCase()}; path=/; max-age=86400; SameSite=Lax`;
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
