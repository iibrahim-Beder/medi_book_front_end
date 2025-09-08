import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  nationalId: "",
  password: "",
  confirmPassword: "",
};

const personalInfoSlice = createSlice({
  name: "personalInfo",
  initialState,
  reducers: {
    // Update multiple fields at once (e.g., when loading data from an API)
    setPersonalInfo: (state, action) => {
      console.log("Setting personal info:", action.payload);
      return { ...state, ...action.payload };
    },

    // Update a single field
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },

    // Reset to initial state
    resetPersonalInfo: () => initialState,
  },
});

export const {
  setPersonalInfo,
  updateField,
  resetPersonalInfo,
} = personalInfoSlice.actions;

export default personalInfoSlice.reducer;
