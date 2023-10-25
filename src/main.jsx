/* eslint-disable no-undef */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { StyleProvider } from "@ant-design/cssinjs";
import { App, Spin } from "antd";
import store from "./store";

import "./index.css";

const IndexPage = React.lazy(() => import("./pages/index"));
const DashboardPage = React.lazy(() => import("./pages/dashboard"));
const Overview = React.lazy(() => import("./components/dashboard/overview"));
const UserManagement = React.lazy(() =>
  import("./components/dashboard/userManagement")
);
const BookManagement = React.lazy(() =>
  import("./components/dashboard/bookManagement")
);
const ContractManagement = React.lazy(() =>
  import("./components/dashboard/contractManagement")
);

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
      {
        path: "/dashboard/contract-management",
        element: <ContractManagement />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <StyleProvider hashPriority="high">
          <Suspense
            fallback={
              <div className="w-full min-h-[100vh] flex justify-center items-center">
                <Spin size="large" />{" "}
              </div>
            }
          >
            <RouterProvider router={router}></RouterProvider>
          </Suspense>
        </StyleProvider>
      </App>
    </Provider>
  </React.StrictMode>
);
