import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../api/baseApi";

import chatsReducer from "../pages/messages/slices/chatsSlice";
import messagesReducer from "../pages/messages/slices/messagesSlice";
import authReducer from "./Slices/login/authSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    chats: chatsReducer,
    messages: messagesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
