import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchBooks = createAsyncThunk(
  "book/fetchBooks",
  async (params, { getState, dispatch }) => {
    dispatch(bookSlice.actions.setLastAction("fetchBooks"));
    const { search, author, category, sort, publisher } = getState().book;
    const { data } = await apiService.get(`books`, {
      params: {
        search,
        author,
        category,
        sort,
        publisher,
        ...params,
      },
    });
    return data;
  }
);

export const fetchBook = createAsyncThunk(
  "book/fetchBook",
  async (bookId, { dispatch }) => {
    dispatch(bookSlice.actions.setLastAction("fetchBook"));
    const { data } = await apiService.get(`books/${bookId}/get`, {});
    return data;
  }
);

export const fetchTotal = createAsyncThunk(
  "book/fetchTotal",
  async (params, { getState }) => {
    const { search, author, category, publisher } = getState().book;
    const { data } = await apiService.get(`books/count`, {
      params: {
        search,
        author,
        category,
        publisher,
        ...params,
      },
    });
    return data;
  }
);

export const createBook = createAsyncThunk(
  "book/createBook",
  async (body, { dispatch }) => {
    dispatch(bookSlice.actions.setLastAction("createBook"));
    const { data } = await apiService.post(`books`, {
      ...body,
    });
    return data;
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async ({ id, body }, { dispatch }) => {
    dispatch(bookSlice.actions.setLastAction("updateBook"));
    const { data } = await apiService.patch(`books/${id}/update`, {
      ...body,
    });
    return data;
  }
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (bookId, { dispatch }) => {
    dispatch(bookSlice.actions.setLastAction("deleteBook"));
    const { data } = await apiService.delete(`books/${bookId}/delete`);
    return data;
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    book: null,
    loading: false,
    error: null,
    search: null,
    author: null,
    category: null,
    publisher: null,
    total: 0,
    sort: "contracts",
    lastAction: null,
  },
  reducers: {
    setBooks(state) {
      state.books = [];
    },
    setBook(state, action) {
      state.book = action.payload;
    },
    setLastAction(state, action) {
      state.lastAction = action.payload;
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
    setPublisher(state, action) {
      state.publisher = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    resetParams(state, action) {
      state.search = null;
      state.category = null;
      state.author = null;
      state.publisher = null;
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
        for (const item of action.payload) {
          item.stockCount = item.count - item.borrowedCount;
        }
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
        state.book = null;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.stockCount =
          action.payload.count - action.payload.borrowedCount;
        state.book = action.payload;
      })
      .addCase(fetchBook.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder.addCase(fetchTotal.fulfilled, (state, action) => {
      state.total = action.payload;
    });

    builder
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(createBook.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(updateBook.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    builder
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBook.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

// Export reducer và actions từ slice
export const {
  setBooks,
  setBook,
  setSearch,
  setAuthor,
  setCategory,
  setTotal,
  setSort,
  setLastAction,
  setPublisher,
  resetParams,
} = bookSlice.actions;

export default bookSlice;
