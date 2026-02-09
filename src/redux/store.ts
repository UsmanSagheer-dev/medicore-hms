import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import receptionistReducer from './slices/receptionistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    receptionist: receptionistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
