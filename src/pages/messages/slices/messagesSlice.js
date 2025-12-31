import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    draft: "",
    typingByChat: {},
  },
  reducers: {
    setDraft: (state, action) => {
      state.draft = action.payload;
    },
    updateTyping: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      const users = state.typingByChat[chatId] || [];

      if (isTyping) {
        if (!users.includes(userId)) {
          state.typingByChat[chatId] = [...users, userId];
        }
      } else {
        const filtered = users.filter(id => id !== userId);

        if (filtered.length === 0) {
          delete state.typingByChat[chatId];
        } else {
          state.typingByChat[chatId] = filtered;
        }
      }
    },
  },
});

export const { setDraft, updateTyping } = messagesSlice.actions;

export const selectIsChatTyping = (chatId) => (state) =>
  state.messages.typingByChat[chatId]?.length > 0;

export const selectTypingUsers = (chatId) => (state) =>
  state.messages.typingByChat[chatId] || [];

export default messagesSlice.reducer;
