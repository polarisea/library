import { combineReducers } from "@reduxjs/toolkit";
import bookSlice from "./slices/bookSlice";
import categorySlice from "./slices/categorySlice";
import authorSlice from "./slices/authorSlice";
import homeSlice from "./slices/homeSlice";
import authSlice from "./slices/authSlice";
import contractSlice from "./slices/contractSlice";
import userSlice from "./slices/userSlice";

const rootReducer = combineReducers({
  home: homeSlice.reducer,
  book: bookSlice.reducer,
  category: categorySlice.reducer,
  author: authorSlice.reducer,
  auth: authSlice.reducer,
  contract: contractSlice.reducer,
  user: userSlice.reducer,
});

export default rootReducer;
