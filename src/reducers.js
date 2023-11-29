import { combineReducers } from "@reduxjs/toolkit";
import book from "./slices/book";
import category from "./slices/category";
import authorSlice from "./slices/author";
import homeSlice from "./slices/homeSlice";
import auth from "./slices/auth";
import contract from "./slices/contract";
import user from "./slices/user";
import publisher from "./slices/publisher";
import chart from "./slices/chart";
import profile from "./slices/profile";
import notify from "./slices/notify";

const rootReducer = combineReducers({
  home: homeSlice.reducer,
  book: book.reducer,
  category: category.reducer,
  author: authorSlice.reducer,
  auth: auth.reducer,
  contract: contract.reducer,
  user: user.reducer,
  publisher: publisher.reducer,
  chart: chart.reducer,
  profile: profile.reducer,
  notify: notify.reducer,
});

export default rootReducer;
