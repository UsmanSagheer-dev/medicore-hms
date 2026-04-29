import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import receptionistReducer from './slices/receptionistSlice';
import patientVisitReducer from './slices/patientVisitSlice';
import scheduleReducer from './slices/scheduleSlice';
import pharmacyReducer from './slices/pharmacySlice';
import medicineReducer from './slices/medicineSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    receptionist: receptionistReducer,
    pharmacy: pharmacyReducer,
    patientVisit: patientVisitReducer,
    schedule: scheduleReducer,
    medicine: medicineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
