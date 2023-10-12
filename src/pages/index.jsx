/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, ConfigProvider } from "antd";

import DefaultLayout from "../layouts/default";
import BookFilter from "../components/bookFilter";
import BookList from "../components/bookList";

import { fetchMe } from "../slices/authSlice";
import { setTab } from "../slices/homeSlice";
import {
  setBooks,
  setSearch,
  setTotal,
  setSort,
  fetchBooks,
  fetchTotal,
} from "../slices/bookSlice";

function Index() {
  const dispatch = useDispatch();
  const tab = useSelector((state) => state.home.tab);

  const tabTokens = {
    cardBg: "rgba(0, 0, 0, 0)",
    itemSelectedColor: "#66FFC8",
    titleFontSize: 17,
    itemColor: "rgba(255,255,255,255)",
    colorBorder: "rgba(0, 0, 0, 0)",
    colorBgContainer: "rgba(0,0,0,0)",
    colorBorderSecondary: "rgba(0,0,0,0)",
  };

  const items = [
    {
      key: "votes",
      label: "Hay nhất",
      children: <BookList sort="votes" />,
    },
    {
      key: "createdAt",
      label: "Mới nhất",
      children: <BookList sort="createdAt" />,
    },
    {
      key: "#",
      label: "Tìm kiếm nâng cao",
      children: <BookFilter />,
    },
  ];

  useEffect(() => {
    {
      dispatch(fetchMe());
      dispatch(fetchTotal());
      dispatch(fetchBooks());
    }
  }, []);

  const onTabChange = async (value) => {
    dispatch(setTab(value));
    dispatch(setSort(value));
    dispatch(setSearch(""));
    if (value == "#") {
      dispatch(setTotal(0));
      dispatch(setBooks());
      return;
    }
    dispatch(fetchTotal());
    dispatch(fetchBooks());
  };
  return (
    <DefaultLayout>
      <div className="w-[90vw] relative  mt-[-10vw]  bg-[rgba(0,0,0,0.25)] mx-auto rounded-2xl sm:px-10 max-sm:px-2 py-5">
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
            ></Tabs>
          </ConfigProvider>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Index;
