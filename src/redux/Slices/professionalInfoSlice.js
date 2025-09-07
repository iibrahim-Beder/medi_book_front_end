import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  specialty: "",
  subspecialty: "",
  licenseNumber: "",
  licenseFile: null,
  languagesSpoken: "",
  specializations: [],
};

const professionalInfoSlice = createSlice({
  name: "professionalInfo",
  initialState,
  reducers: {
    // Add new data (e.g. after first registration or reset)
    addNewProfessionalInfo: (state, action) => {
      return { ...state, ...action.payload };
    },

    // Update one or more fields
    updateProfessionalInfo: (state, action) => {
      return { ...state, ...action.payload };
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
  addNewProfessionalInfo,
  updateProfessionalInfo,
  addSpecialization,
  editSpecialization,
  removeSpecialization,
  resetProfessionalInfo,
} = professionalInfoSlice.actions;

export default professionalInfoSlice.reducer;
