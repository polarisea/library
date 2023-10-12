import { createSlice } from "@reduxjs/toolkit";
// import { apiService } from "../services/api";

// export const fetchAuthors = createAsyncThunk(
//   "author/fetchAuthors",
//   async (params) => {
//     const { data } = await apiService.get(`authors`, {
//       params: {
//         ...params,
//       },
//     });
//     return data;
//   },
// );

// export const fetchTotal = createAsyncThunk(
//   "author/fetchTotal",
//   async (params) => {
//     const { data } = await apiService.get(`authors/count`, {
//       params: {
//         ...params,
//       },
//     });
//     return data;
//   },
// );

const homeSlice = createSlice({
  name: "author",
  initialState: {
    tab: "votes",
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    setTab(state, action) {
      state.tab = action.payload;
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(fetchAuthors.pending, (state) => {
  //         state.loading = true;
  //         state.authors = [];
  //         state.error = null;
  //       })
  //       .addCase(fetchAuthors.fulfilled, (state, action) => {
  //         state.loading = false;
  //         state.authors = action.payload;
  //       })
  //       .addCase(fetchAuthors.rejected, (state, action) => {
  //         state.loading = false;
  //         state.error = action.error.message;
  //       });
  //     builder
  //       .addCase(fetchTotal.pending, (state) => {
  //         state.error = null;
  //       })
  //       .addCase(fetchTotal.fulfilled, (state, action) => {
  //         state.total = action.payload;
  //       })
  //       .addCase(fetchTotal.rejected, (state, action) => {
  //         state.error = action.error.message;
  //       });
  //   },
});

// Export reducer và actions từ slice
export const { setTab } = homeSlice.actions;

export default homeSlice;
