import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  qualifications: [],
};

const qualificationsSlice = createSlice({
  name: "qualifications",
  initialState,
  reducers: {
    setQualifications: (state, action) => {
      console.log("Dispatching qualifications:", action.payload);
      state.qualifications = action.payload;
    },
    addQualification: (state, action) => {
      state.qualifications.push(action.payload);
    },
    updateQualification: (state, action) => {
      const { id, field, value } = action.payload;
      state.qualifications = state.qualifications.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      );
    },
    deleteQualification: (state, action) => {
      state.qualifications = state.qualifications.filter(
        (q) => q.id !== action.payload
      );
    },
    resetQualifications: () => initialState,
  },
});

export const {
  setQualifications,
  addQualification,
  updateQualification,
  deleteQualification,
  resetQualifications,
} = qualificationsSlice.actions;

export default qualificationsSlice.reducer;
