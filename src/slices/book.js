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

export const fetchStatusCount = createAsyncThunk(
  "book/fetchStatusCount",
  async () => {
    const { data } = await apiService.get(`books/status-count`, {});
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

export const fetchContractHistory = createAsyncThunk(
  "book/contractHistory",
  async (params) => {
    const { data } = await apiService.get(`contracts`, {
      params: {
        ...params,
      },
    });
    return data;
  }
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
  }
);

export const requestAppointment = createAsyncThunk(
  "book/requestAppointment",
  async (body) => {
    const { data } = await apiService.post(`books/request-appointment`, {
      ...body,
    });
    return data;
  }
);

export const vote = createAsyncThunk("book/vote", async (body) => {
  const { data } = await apiService.patch(`votes`, {
    ...body,
  });
  return data;
});

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
    statusCount: null,
    sort: "votes",
    contractHistory: null,
    totalContractHistory: 0,
    lastAction: null,
  },
  reducers: {
    setBooks(state) {
      state.books = [];
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
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
        state.book = null;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(fetchBook.rejected, (state) => {
        state.loading = false;
        state.error = "Tải thông tin book thất bại";
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
      .addCase(fetchStatusCount.pending, (state) => {
        state.error = null;
        state.statusCount = null;
      })
      .addCase(fetchStatusCount.fulfilled, (state, action) => {
        state.statusCount = action.payload;
      })
      .addCase(fetchStatusCount.rejected, (state, action) => {
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
      .addCase(createBook.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
    builder
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state) => {
        state.loading = false;
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
  setSearch,
  setAuthor,
  setCategory,
  setTotal,
  setSort,
  setLastAction,
  setPublisher,
} = bookSlice.actions;

export default bookSlice;
