import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params) => {
    const { data } = await apiService.get(`categories`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

export const fetchTotal = createAsyncThunk(
  "category/fetchTotal",
  async (params) => {
    const { data } = await apiService.get(`categories/count`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.categories = [];
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
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
// export const { setSearch, setSort } = categorySlice.actions;

export default categorySlice;
