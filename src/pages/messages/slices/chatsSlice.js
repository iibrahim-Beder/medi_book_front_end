// slices/chatsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
  name: "chats",
  initialState: {
    selectedChatId: null,
    isChatOpen: false,
  },
  reducers: {
    selectChat: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setIsChatOpen: (state, action) => {
      state.isChatOpen = action.payload;
    },
  },
});


export const { selectChat,setIsChatOpen } = chatsSlice.actions;
export default chatsSlice.reducer;
