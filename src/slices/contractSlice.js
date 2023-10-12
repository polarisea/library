import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchTotal = createAsyncThunk(
  "contract/fetchTotal",
  async (params) => {
    const { data } = await apiService.get(`contracts/count`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

const contractSlice = createSlice({
  name: "contract",
  initialState: {
    contracts: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
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
// export const { setSearch, setSort } = contractSlice.actions;

export default contractSlice;
