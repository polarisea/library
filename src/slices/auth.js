/* eslint-disable no-undef */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";
import { ROLES } from "../constants";

export const register = createAsyncThunk(
  "auth/register",
  async ({ body }, { dispatch }) => {
    dispatch(authSlice.actions.setLastAction("register"));
    const { data } = await apiService.post(`auth/register`, body);
    return data;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ loginMethod, body }, { dispatch }) => {
    dispatch(authSlice.actions.setLastAction("login"));
    const { data } = await apiService.post(`auth/login/${loginMethod}`, body);
    return data;
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (body, { dispatch }) => {
    dispatch(authSlice.actions.setLastAction("changePassword"));
    const { data } = await apiService.post(`auth/change-password`, body);
    return data;
  }
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
    isRoot: false,
    loading: false,
    error: null,
    lastAction: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAdmin = null;
      state.isRoot = null;
      localStorage.removeItem("token");
      apiService.defaults.headers.common["Authorization"] = ``;
    },
    setUser(state, action) {
      state.user = { ...action.payload };
    },
    setLastAction(state, action) {
      state.lastAction = action.payload;
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
        const { user, token, remember } = action.payload;
        apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (remember) {
          localStorage.setItem("token", token);
        }
        state.isAdmin = user.role == ROLES.admin.value;
        state.isRoot = user.role == ROLES.root.value;

        state.user = user;
        state.token = token;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
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
        state.isAdmin = user.role == ROLES.admin.value;
        state.isRoot = user.role == ROLES.root.value;
        state.user = user;
        state.token = token;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.user = user;
        state.isAdmin = user.role == ROLES.admin.value;
        state.isRoot = user.role == ROLES.root.value;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { logout, setUser, setLastAction } = authSlice.actions;

export default authSlice;
