// redux/Slices/professionalInfoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  specialty: "",
  yearsOfExperience: "",
  licenseNumber: "",
  bio: "",
  licenseFile: null,
  languagesSpoken: [],
  specializations: [],
};

const professionalInfoSlice = createSlice({
  name: "professionalInfo",
  initialState,
  reducers: {
    // Update multiple fields at once (e.g., when loading data from an API)
    setProfessionalInfo: (state, action) => {
      console.log("Setting professional info:", action.payload);
      return { ...state, ...action.payload };
    },

    // Update a single field
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    // Array operations (languages)
    addLanguage: (state, action) => {
      state.languagesSpoken.push(action.payload);
    },
    editLanguage: (state, action) => {
      const { index, value } = action.payload;
      state.languagesSpoken[index] = value;
    },
    removeLanguage: (state, action) => {
      state.languagesSpoken.splice(action.payload, 1);
    },

    // Array operations (specializations)
    addSpecialization: (state, action) => {
      state.specializations.push(action.payload);
    },
    editSpecialization: (state, action) => {
      const { index, value } = action.payload;
      state.specializations[index] = value;
    },
    removeSpecialization: (state, action) => {
      state.specializations.splice(action.payload, 1);
    },

    // Reset to initial state
    resetProfessionalInfo: () => initialState,
  },
});

export const {
  setProfessionalInfo,
  updateField,
  addLanguage,
  editLanguage,
  removeLanguage,
  addSpecialization,
  editSpecialization,
  removeSpecialization,
  resetProfessionalInfo,
} = professionalInfoSlice.actions;

export default professionalInfoSlice.reducer;
