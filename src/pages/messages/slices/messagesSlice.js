import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    isTyping: false,
    draft: "",
  },
  reducers: {
    setDraft: (state, action) => {
      state.draft = action.payload;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
  },
});

export const { setDraft, setTyping } = messagesSlice.actions;
export default messagesSlice.reducer;
