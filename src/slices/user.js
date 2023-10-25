import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (params, { getState, dispatch }) => {
    dispatch(userSlice.actions.setLastAction("fetchUsers"));
    const { search } = getState().user;
    const { data } = await apiService.get(`users`, {
      params: {
        search,
        ...params,
      },
    });
    return data;
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (userId, { dispatch }) => {
    dispatch(userSlice.actions.setLastAction("fetchUser"));

    const { data } = await apiService.get(`users/${userId}/get`, {});
    return data;
  }
);

export const grantPermission = createAsyncThunk(
  "user/grantPermission",
  async ({ id, role }, { dispatch }) => {
    dispatch(userSlice.actions.setLastAction("grantPermission"));
    const { data } = await apiService.patch(`users/${id}/grant-permission`, {
      role,
    });
    return data;
  }
);

export const fetchTotal = createAsyncThunk(
  "user/fetchTotal",
  async (params, { getState }) => {
    const { search } = getState().user;
    const { data } = await apiService.get(`users/count`, {
      params: {
        search,
        ...params,
      },
    });
    return data;
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, body }, { dispatch }) => {
    dispatch(userSlice.actions.setLastAction("updateUser"));

    const { data } = await apiService.patch(`users/${userId}/update`, body);
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { dispatch }) => {
    dispatch(userSlice.actions.setLastAction("deleteUser"));

    const { data } = await apiService.delete(`users/${userId}/delete`);
    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
    total: 0,
    search: null,
    lastAction: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setLastAction(state, action) {
      state.lastAction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.users = [];
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Tải danh sách user thất bại";
      });
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.error = "Tải thông tin user thất bại";
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
    builder
      .addCase(grantPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(grantPermission.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(grantPermission.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
    builder
      .addCase(fetchTotal.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTotal.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(fetchTotal.rejected, (state) => {
        state.error = true;
      });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

// Export reducer và actions từ slice
export const { setUser, setSearch, setLastAction } = userSlice.actions;

export default userSlice;
