import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../services/api";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userId: null,
    open: false,
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setOpen(state, action) {
      state.open = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setUserId, setOpen } = profileSlice.actions;

export default profileSlice;
