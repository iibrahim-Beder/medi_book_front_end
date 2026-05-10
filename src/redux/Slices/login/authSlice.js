import { createSlice } from "@reduxjs/toolkit";
// const persistedAuth = localStorage.getItem("auth");
const localAuth = localStorage.getItem("auth");
const sessionAuth = sessionStorage.getItem("auth");

const persistedAuth = localAuth || sessionAuth;
const initialAuth = persistedAuth ? JSON.parse(persistedAuth) : null;
console.log("initialAuth", initialAuth);

const initialState = {
  accessToken: initialAuth?.accessToken || null,
  refreshToken: initialAuth?.refreshToken || null,
  email: initialAuth?.refreshToken?.email || null,
  doctorId: initialAuth?.refreshToken?.userId || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log("initialAuth action.payload", action.payload, "state", state);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.email = action.payload.refreshToken.email;
      state.doctorId = action.payload.refreshToken.userId;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.doctorId = null;

      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;