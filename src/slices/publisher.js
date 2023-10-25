import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchPublishers = createAsyncThunk(
  "publisher/fetchPublishers",
  async (params) => {
    const { data } = await apiService.get(`publishers`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

export const fetchTotal = createAsyncThunk(
  "publisher/fetchTotal",
  async (params) => {
    const { data } = await apiService.get(`publishers/count`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

const publisherSlice = createSlice({
  name: "publisher",
  initialState: {
    publishers: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishers.pending, (state) => {
        state.loading = true;
        state.publishers = [];
        state.error = null;
      })
      .addCase(fetchPublishers.fulfilled, (state, action) => {
        state.loading = false;
        state.publishers = action.payload;
      })
      .addCase(fetchPublishers.rejected, (state, action) => {
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
// export const { setSearch, setSort } = publisherSlice.actions;

export default publisherSlice;
