import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchBooks = createAsyncThunk(
  "book/fetchBooks",
  async (params, { getState }) => {
    const { search, author, category, sort } = getState().book;
    const { data } = await apiService.get(`books`, {
      params: {
        search,
        author,
        category,
        sort,
        ...params,
      },
    });
    return data;
  },
);

export const fetchTotal = createAsyncThunk(
  "book/fetchTotal",
  async (params, { getState }) => {
    const { search, author, category } = getState().book;
    const { data } = await apiService.get(`books/count`, {
      params: {
        search,
        author,
        category,
        ...params,
      },
    });
    return data;
  },
);

export const createBook = createAsyncThunk("book/createBook", async (body) => {
  const { data } = await apiService.post(`books`, {
    ...body,
  });
  return data;
});

export const fetchContractHistory = createAsyncThunk(
  "book/contractHistory",
  async (params) => {
    const { data } = await apiService.get(`contracts`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

export const fetchTotalContractHistory = createAsyncThunk(
  "book/totalContractHistory",
  async (params) => {
    const { data } = await apiService.get(`contracts/count`, {
      params: {
        ...params,
      },
    });
    return data;
  },
);

export const requestAppointment = createAsyncThunk(
  "book/requestAppointment",
  async (body) => {
    const { data } = await apiService.post(`books/request-appointment`, {
      ...body,
    });
    return data;
  },
);

export const vote = createAsyncThunk("book/vote", async (body) => {
  const { data } = await apiService.patch(`votes`, {
    ...body,
  });
  return data;
});

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    loading: false,
    error: null,
    search: null,
    author: "",
    category: "",
    total: 0,
    sort: "votes",
    contractHistory: null,
    totalContractHistory: 0,
  },
  reducers: {
    setBooks(state) {
      state.books = [];
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setAuthor(state, action) {
      state.author = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.books = [];
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
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
    builder
      .addCase(fetchContractHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.contractHistory = action.payload;
      })
      .addCase(fetchContractHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(fetchTotalContractHistory.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTotalContractHistory.fulfilled, (state, action) => {
        state.totalContractHistory = action.payload;
      })
      .addCase(fetchTotalContractHistory.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(requestAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestAppointment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(vote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(vote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer và actions từ slice
export const {
  setBooks,
  setSearch,
  setAuthor,
  setCategory,
  setTotal,
  setSort,
} = bookSlice.actions;

export default bookSlice;
