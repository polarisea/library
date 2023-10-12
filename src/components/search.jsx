import { useState } from "react";
import { useDispatch } from "react-redux";

import { Input, Button, Space } from "antd";

import { setSearch, fetchBooks, fetchTotal } from "../slices/bookSlice";
import { setTab } from "../slices/homeSlice";

function Search() {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const onSearch = () => {
    dispatch(setSearch(keyword));
    dispatch(setTab("#"));
    dispatch(fetchBooks({ search: keyword }));
    dispatch(fetchTotal());
    scrollTo({
      top: window.innerWidth * 0.55,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Space.Compact>
        <Input
          className="sm:w-[20rem] max-sm:w-[15rem]"
          placeholder="Nhập tên sách"
          size="large"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        ></Input>
        <Button
          className="bg-gray-200 text-black"
          type="primary"
          size="large"
          onClick={onSearch}
        >
          Tìm kiếm
        </Button>
      </Space.Compact>
    </>
  );
}

export default Search;
