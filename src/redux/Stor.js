import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import experienceReduser from "./Slices/doctor-information/experienceSlice";
import professionalInfoReduser from "./Slices/doctor-information/professionalInfoSlice";
import personalInforeduser from "./Slices/doctor-information/personalInfoSlice";
import qualificationsReduser from "./Slices/doctor-information/qualificationsSlice";
import patientReducer from "./Slices/patient/patientSlice";
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ['theme'],
  serialize: (data) => {
    try {
      return JSON.stringify(data);
    } catch (e) {
      console.error('Error serializing state:', e);
      return JSON.stringify({});
    }
  },
  deserialize: (data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error deserializing state:', e);
      return {};
    }
  }
};


export const store = configureStore({
  reducer: {
    theme: 22,
    experience: experienceReduser,
    professionalInfo: professionalInfoReduser,
    PersonalInfo: personalInforeduser,
    qualifications: qualificationsReduser,
       patient: patientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);