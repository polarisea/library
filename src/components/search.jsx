import { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  setSearch,
  setPublisher,
  setCategory,
  setAuthor,
  fetchBooks,
  fetchTotal,
} from "../slices/book";
import { setTab } from "../slices/homeSlice";

function Search() {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  const onSearch = () => {
    dispatch(setPublisher(null));
    dispatch(setAuthor(null));
    dispatch(setCategory(null));
    dispatch(setTab("#"));
    dispatch(setSearch(keyword));
    setKeyword(null);
    dispatch(
      fetchBooks({
        search: keyword,
        author: null,
        category: null,
        publisher: null,
      })
    );
    dispatch(
      fetchTotal({
        search: keyword,
        author: null,
        category: null,
        publisher: null,
      })
    );
    scrollTo({
      top: window.innerWidth * 0.55,
      behavior: "smooth",
    });
  };
  return (
    <>
      <span className="w-[20rem] block shadow-lg">
        <Input
          className="rounded-[10rem]"
          placeholder="Nhập tên sách"
          size="large"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          suffix={
            <SearchOutlined
              size="large"
              style={{ color: "rgba(0, 0, 0, 0.45)" }}
            />
          }
          onPressEnter={onSearch}
        ></Input>
      </span>
    </>
  );
}

export default Search;
