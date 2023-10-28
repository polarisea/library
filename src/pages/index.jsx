/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, ConfigProvider } from "antd";

import DefaultLayout from "../layouts/default";
import BookFilter from "../components/bookFilter";
import BookList from "../components/bookList";

import { fetchMe } from "../slices/auth";
import { setTab } from "../slices/homeSlice";

import {
  setBooks,
  setSearch,
  setTotal,
  setSort,
  fetchBooks,
  fetchTotal,
} from "../slices/book";

const tabTokens = {
  cardBg: "rgba(0, 0, 0, 0)",
  // itemSelectedColor: "#66FFC8",
  titleFontSize: 17,
  // itemColor: "rgba(255,255,255,255)",
  colorBorder: "rgba(0, 0, 0, 0)",
  colorBgContainer: "rgba(0,0,0,0)",
  colorBorderSecondary: "rgba(0,0,0,0)",
};

const items = [
  {
    key: "contracts",
    label: "Mượn nhiều nhất",
    children: <BookList />,
  },
  {
    key: "createdAt",
    label: "Mới nhất",
    children: <BookList />,
  },
  {
    key: "#",
    label: "Tìm kiếm nâng cao",
    children: <BookFilter />,
  },
];

function Index() {
  const dispatch = useDispatch();
  const tab = useSelector((state) => state.home.tab);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchTotal());
    dispatch(fetchBooks());
  }, []);

  const onTabChange = async (value) => {
    dispatch(setTab(value));
    dispatch(setSort(value));
    dispatch(setSearch(null));

    if (value == "#") {
      dispatch(setTotal(0));
      dispatch(setBooks());
      return;
    }
    dispatch(
      fetchTotal({
        search: null,
        author: null,
        category: null,
        publisher: null,
      })
    );
    dispatch(
      fetchBooks({
        search: null,
        author: null,
        category: null,
        publisher: null,
        sort: value,
      })
    );
  };

  return (
    <DefaultLayout>
      <div className="w-[90vw] max-lg:w-[95vw] relative     mx-auto rounded-2xl lg:px-10 max-lg:px-2 py-5">
        <div className="">
          <ConfigProvider
            theme={{
              components: {
                Tabs: tabTokens,
              },
            }}
          >
            <Tabs
              activeKey={tab}
              items={items}
              type="card"
              size="size"
              tabBarStyle={{
                fontWeight: 600,
                marginBottom: 0,
              }}
              onChange={onTabChange}
              destroyInactiveTabPane={true}
            ></Tabs>
          </ConfigProvider>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Index;
