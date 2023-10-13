/* eslint-disable no-undef */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";
import { ROLE_TYPES } from "../constants";

export const register = createAsyncThunk("auth/register", async ({ body }) => {
  const { data } = await apiService.post(`auth/register`, body);
  return data;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ loginMethod, body }) => {
    const { data } = await apiService.post(`auth/login/${loginMethod}`, body);
    return data;
  },
);

export const fetchMe = createAsyncThunk("auth/me", async (params) => {
  const { data } = await apiService.get(`auth/me`, {
    params: {
      ...params,
    },
  });
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAdmin: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      console.log("Logout");
      state.user = null;
      state.token = null;
      state.isAdmin = null;
      localStorage.removeItem("token");
      apiService.defaults.headers.common["Authorization"] = ``;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (remember) {
          localStorage.setItem("token", token);
        }
        state.isAdmin = user.role == ROLE_TYPES.admin.value;
        state.user = user;
        state.token = token;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
        state.error = action.payload.errors;
      });

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, token, remember } = action.payload;
        apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (remember) {
          localStorage.setItem("token", token);
        }
        state.isAdmin = user.role == ROLE_TYPES.admin.value;
        state.user = user;
        state.token = token;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.isAdmin = user.role == ROLE_TYPES.admin.value;
        state.user = user;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice;
