/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button } from "antd";

import BookList from "./bookList";
import {
  setAuthor,
  setCategory,
  fetchBooks,
  fetchTotal,
} from "../slices/bookSlice";
import { fetchAuthors } from "../slices/authorSlice";
import { fetchCategories } from "../slices/categorySlice";

function BookFilter() {
  const dispatch = useDispatch();
  const authors = useSelector((state) => state.author.authors);
  const categories = useSelector((state) => state.category.categories);

  const authorsOptions = authors.map((author) => {
    return { label: author.name, value: author._id };
  });
  const categoriesOptions = categories.map((category) => {
    return { label: category.title, value: category._id };
  });

  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
  }, []);

  const onSubmit = async () => {
    dispatch(fetchTotal());
    dispatch(fetchBooks());
  };

  return (
    <div>
      <div className="flex mb-5 flex-wrap">
        <Select
          placeholder="Tác giả"
          className="sm:w-1/4 max-sm:w-full"
          size="large"
          options={authorsOptions}
          allowClear
          onChange={(value) => dispatch(setAuthor(value))}
        ></Select>
        <Select
          placeholder="Thể loại"
          className="sm:w-1/4 max-sm:w-full max-sm:my-2 sm:mx-2"
          size="large"
          options={categoriesOptions}
          allowClear
          onChange={(value) => dispatch(setCategory(value))}
        ></Select>
        <Button
          className="preflight"
          type="primary"
          size="large"
          onClick={onSubmit}
        >
          Lọc
        </Button>
      </div>
      {<BookList></BookList>}
    </div>
  );
}

export default BookFilter;
