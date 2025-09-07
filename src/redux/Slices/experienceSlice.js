import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    // Add new experience
    addExperience: (state, action) => {
      const newExperience = {
        id: Date.now(), // Local id (you can replace it with uuid or id from backend)
        ...action.payload,
      };
      state.push(newExperience);
    },

    // Update an existing experience by id
    updateExperience: (state, action) => {
      const { id, data } = action.payload;
      const index = state.findIndex((exp) => exp.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...data };
      }
    },

    // Remove an experience by id
    removeExperience: (state, action) => {
      return state.filter((exp) => exp.id !== action.payload);
    },

    // Replace all experiences (for example coming from API)
    setExperiences: (state, action) => {
      console.log("Setting experiences:", action.payload);
      return action.payload;
    },

    // Reset to initial state
    resetExperiences: () => initialState,
  },
});

export const {
  addExperience,
  updateExperience,
  removeExperience,
  setExperiences,
  resetExperiences,
} = experienceSlice.actions;

export default experienceSlice.reducer;
