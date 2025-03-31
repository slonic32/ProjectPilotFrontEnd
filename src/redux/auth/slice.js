import { createSlice } from "@reduxjs/toolkit";
import { add, login, logout, refresh, editUser } from "./operations";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

function handlePending(state) {
  state.loading = true;
}

function handleRejected(state, action) {
  state.loading = false;
  state.error = action.payload;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      name: null,
      email: null,
      avatarURL: null,
      phone: null,
      admin: false,
      pm: false,
    },
    token: null,
    refreshToken: null,
    isLoggedIn: false,
    isRefreshing: false,
    loading: false,
    error: null,
  },
  reducers: {
    updateToken(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    updateTokenError(state) {
      state.user = {
        name: null,
        email: null,
        avatarURL: null,
        phone: null,
        admin: false,
        pm: false,
      };
      state.token = null;
      state.refreshToken = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add.fulfilled, (state, action) => {
        /* state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.user.phone = action.payload.user.phone;
        state.user.admin = action.payload.user.admin;
        state.user.pm = action.payload.user.pm;
        state.user.avatarURL = "";
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLoggedIn = true;  */
        state.error = null;
        state.loading = false;
      })
      .addCase(add.pending, handlePending)
      .addCase(add.rejected, handleRejected)
      .addCase(login.fulfilled, (state, action) => {
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.user.phone = action.payload.user.phone;
        state.user.admin = action.payload.user.admin;
        state.user.pm = action.payload.user.pm;
        state.user.avatarURL = action.payload.user.avatarURL;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isLoggedIn = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(login.pending, handlePending)
      .addCase(login.rejected, handleRejected)
      .addCase(logout.fulfilled, (state) => {
        state.user = {
          name: null,
          email: null,
          avatarURL: null,
          phone: null,
          admin: false,
          pm: false,
        };
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(logout.pending, handlePending)
      .addCase(logout.rejected, handleRejected)
      .addCase(refresh.pending, (state) => {
        state.isRefreshing = true;
        state.loading = true;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.user.phone = action.payload.user.phone;
        state.user.admin = action.payload.user.admin;
        state.user.pm = action.payload.user.pm;
        state.user.avatarURL = action.payload.avatarURL;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(refresh.rejected, (state) => {
        state.user = {
          name: null,
          email: null,
          avatarURL: null,
          phone: null,
          admin: false,
          pm: false,
        };
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.error = null;
        state.loading = false;
        state.isRefreshing = false;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.user.phone = action.payload.user.phone;
        state.user.admin = action.payload.user.admin;
        state.user.pm = action.payload.user.pm;
        state.user.avatarURL = action.payload.avatarURL;
        state.error = null;
        state.loading = false;
      })
      .addCase(editUser.pending, handlePending)
      .addCase(editUser.rejected, handleRejected);
  },
});

// Persisting token field from auth slice to localstorage
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "refreshToken"],
};

const persistedReducer = persistReducer(authPersistConfig, authSlice.reducer);
export const authReducer = persistedReducer;

export const { updateToken, updateTokenError } = authSlice.actions;
