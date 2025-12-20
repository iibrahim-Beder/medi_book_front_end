// slices/chatsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    selectedChatId: 1,
  },
  reducers: {
    selectChat: (state, action) => {
      state.selectedChatId = action.payload;
    },
  },
});

export const { selectChat } = chatsSlice.actions;
export default chatsSlice.reducer;
