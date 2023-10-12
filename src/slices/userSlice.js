import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (params, { getState }) => {
    const { search } = getState().user;
    const { data } = await apiService.get(`users`, {
      params: {
        search,
        ...params,
      },
    });
    return data;
  },
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
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    total: 0,
    search: null,
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
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
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(fetchTotal.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTotal.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(fetchTotal.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// Export reducer và actions từ slice
export const { setSearch } = userSlice.actions;

export default userSlice;
