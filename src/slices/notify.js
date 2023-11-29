import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

export const fetchNotifies = createAsyncThunk(
  "notify/fetchNotifies",
  async (params, { dispatch }) => {
    dispatch(notifySlice.actions.setLastAction("fetchNotifies"));
    const { data } = await apiService.get(`notifies`, {
      params: {
        ...params,
      },
    });
    return data;
  }
);

export const fetchTotal = createAsyncThunk(
  "notify/fetchTotal",
  async (params) => {
    const { data } = await apiService.get(`notifies/count`, {
      params: {
        ...params,
      },
    });
    return data;
  }
);

export const createNotify = createAsyncThunk(
  "notify/createNotify",
  async (body, { dispatch }) => {
    dispatch(notifySlice.actions.setLastAction("createNotify"));
    const { data } = await apiService.post(`notifies`, {
      ...body,
    });
    return data;
  }
);

export const deleteNotify = createAsyncThunk(
  "notify/deleteNotify",
  async (bookId, { dispatch }) => {
    dispatch(notifySlice.actions.setLastAction("deleteNotify"));
    const { data } = await apiService.delete(`notifies/${bookId}/delete`);
    return data;
  }
);

const notifySlice = createSlice({
  name: "notify",
  initialState: {
    notifies: [],
    notify: null,
    loading: false,
    error: null,
    total: 0,
    lastAction: null,
  },
  reducers: {
    setLastAction(state, action) {
      state.lastAction = action.payload;
    },
    setNotify(state, action) {
      state.notify = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifies.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchNotifies.fulfilled, (state, action) => {
        state.notifies = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifies.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });

    builder
      .addCase(fetchTotal.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchTotal.fulfilled, (state, action) => {
        state.total = action.payload;
        state.loading = false;
      })
      .addCase(fetchTotal.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });

    builder
      .addCase(createNotify.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createNotify.fulfilled, (state, action) => {
        state.notify = action.payload;
        state.loading = false;
      })
      .addCase(createNotify.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });

    builder
      .addCase(deleteNotify.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteNotify.fulfilled, (state, action) => {
        state.notify = action.payload;
        state.loading = false;
      })
      .addCase(deleteNotify.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

// Export reducer và actions từ slice
export const { setLastAction, setNotify } = notifySlice.actions;

export default notifySlice;
