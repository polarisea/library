/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { StyleProvider } from "@ant-design/cssinjs";

import store from "./store";
import IndexPage from "./pages/index";
import DashboardPage from "./pages/dashboard";
import Overview from "./components/dashboard/overview";
import UserManagement from "./components/dashboard/userManagement";
import BookManagement from "./components/dashboard/bookManagement";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    children: [
      { path: "/dashboard", element: <Overview /> },
      { path: "/dashboard/user-management", element: <UserManagement /> },
      { path: "/dashboard/book-management", element: <BookManagement /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <StyleProvider hashPriority="high">
        <RouterProvider router={router}></RouterProvider>
      </StyleProvider>
    </Provider>
  </React.StrictMode>,
);
