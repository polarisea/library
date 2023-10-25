import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchBookStatusCount = createAsyncThunk(
  "chart/fetchBookStatusCount",
  async () => {
    const { data } = await apiService.get(`books/status-count`, {});
    return data;
  }
);

export const fetchBorrowedBookCount = createAsyncThunk(
  "chart/fetchBorrowedBookCount",
  async () => {
    const { data } = await apiService.get(`books/borrowed-book-count`);
    return data;
  }
);

export const fetchBookInCategoryCount = createAsyncThunk(
  "chart/fetchBookInCategoryCount",
  async () => {
    const { data } = await apiService.get(`books/book-in-category-count`, {});
    return data;
  }
);

export const fetchContractStatusCount = createAsyncThunk(
  "chart/fetchContractStatusCount",
  async () => {
    const { data } = await apiService.get(`contracts/status-count`, {});
    return data;
  }
);

export const fetchContractCountInLast12Months = createAsyncThunk(
  "chart/fetchContractCountInLast12Months",
  async () => {
    const { data } = await apiService.get(
      `contracts/contract-count-in-last-12-months`,
      {}
    );
    return data;
  }
);

const chartSlice = createSlice({
  name: "chart",
  initialState: {
    loading: false,
    error: null,
    bookStatusCount: null,
    borrowedBookCount: null,
    bookInCategoryCount: null,
    contractStatusCount: null,
    contractCountInLast12months: null,
    lastAction: null,
  },
  reducers: {
    setLastAction(state, action) {
      state.lastAction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookStatusCount.pending, (state) => {
        state.error = null;
        state.bookStatusCount = null;
      })
      .addCase(fetchBookStatusCount.fulfilled, (state, action) => {
        state.bookStatusCount = action.payload;
      })
      .addCase(fetchBookStatusCount.rejected, (state, action) => {
        state.error = true;
      });
    builder
      .addCase(fetchBorrowedBookCount.pending, (state) => {
        state.error = null;
        state.borrowedBookCount = null;
      })
      .addCase(fetchBorrowedBookCount.fulfilled, (state, action) => {
        state.borrowedBookCount = action.payload;
      })
      .addCase(fetchBorrowedBookCount.rejected, (state, action) => {
        state.error = true;
      });
    builder
      .addCase(fetchBookInCategoryCount.pending, (state) => {
        state.error = null;
        state.bookInCategoryCount = null;
      })
      .addCase(fetchBookInCategoryCount.fulfilled, (state, action) => {
        state.bookInCategoryCount = action.payload;
      })
      .addCase(fetchBookInCategoryCount.rejected, (state, action) => {
        state.error = true;
      });
    builder
      .addCase(fetchContractStatusCount.pending, (state) => {
        state.error = null;
        state.contractStatusCount = null;
      })
      .addCase(fetchContractStatusCount.fulfilled, (state, action) => {
        state.contractStatusCount = action.payload;
      })
      .addCase(fetchContractStatusCount.rejected, (state, action) => {
        state.error = true;
      });
    builder
      .addCase(fetchContractCountInLast12Months.pending, (state) => {
        state.error = null;
        state.contractCountInLast12months = null;
      })

      .addCase(fetchContractCountInLast12Months.fulfilled, (state, action) => {
        state.contractCountInLast12months = action.payload;
      })
      .addCase(fetchContractCountInLast12Months.rejected, (state, action) => {
        state.error = true;
      });
  },
});

// Export reducer và actions từ slice
export const {} = chartSlice.actions;

export default chartSlice;
