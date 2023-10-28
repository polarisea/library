/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Button, Input } from "antd";

import BookList from "./bookList";
import {
  setAuthor,
  setCategory,
  setPublisher,
  setSearch,
  fetchBooks,
  fetchTotal,
} from "../slices/book";
import { fetchAuthors } from "../slices/author";
import { fetchCategories } from "../slices/category";
import { fetchPublishers } from "../slices/publisher";

function BookFilter() {
  const dispatch = useDispatch();
  const authors = useSelector((state) => state.author.authors);
  const categories = useSelector((state) => state.category.categories);
  const publishers = useSelector((state) => state.publisher.publishers);
  const search = useSelector((state) => state.book.search);
  const author = useSelector((state) => state.book.author);
  const category = useSelector((state) => state.book.category);
  const publisher = useSelector((state) => state.book.publisher);
  const [keyword, setKeyword] = useState(null);
  const [initAuthor, setInitAuthor] = useState(null);
  const [initCategory, setInitCategory] = useState(null);
  const [initPublisher, setInitPublisher] = useState(null);

  const authorsOptions = useMemo(() => {
    return authors.map((v) => ({ label: v, value: v }));
  }, [authors]);

  const categoriesOptions = useMemo(() => {
    return categories.map((v) => ({ label: v, value: v }));
  }, [categories]);

  const publishersOptions = useMemo(() => {
    return publishers.map((v) => ({ label: v, value: v }));
  }, [publishers]);

  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchCategories());
    dispatch(fetchPublishers());
  }, []);

  useEffect(() => {
    setKeyword(search);
  }, [search]);

  useEffect(() => {
    setInitAuthor(author);
  }, [author]);

  useEffect(() => {
    setInitCategory(category);
  }, [category]);

  useEffect(() => {
    setInitPublisher(publisher);
  }, [publisher]);

  const onSubmit = async () => {
    dispatch(fetchTotal({ search: keyword }));
    dispatch(fetchBooks({ search: keyword }));
  };

  return (
    <div>
      <div className="flex mb-5 flex-wrap gap-2 max-lg:justify-end">
        <Input
          value={keyword}
          onChange={(e) => {
            dispatch(setSearch(e.target.value));
            setKeyword(e.target.value);
          }}
          placeholder="Từ khóa"
          className="lg:w-1/4 max-lg:w-full"
          size="large"
          allowClear
        />
        <Select
          value={initAuthor}
          placeholder="Tác giả"
          className="lg:w-1/4 max-lg:w-full"
          size="large"
          options={authorsOptions}
          allowClear
          onChange={(value) => dispatch(setAuthor(value))}
        ></Select>
        <Select
          value={initCategory}
          placeholder="Thể loại"
          className="lg:w-1/4 max-lg:w-full max-lg:my-2 lg:mx-2"
          size="large"
          options={categoriesOptions}
          allowClear
          onChange={(value) => dispatch(setCategory(value))}
        ></Select>
        <Select
          value={initPublisher}
          placeholder="Nhà xuất bản"
          className="lg:w-1/4 max-lg:w-full max-lg:my-2 lg:mx-2"
          size="large"
          options={publishersOptions}
          allowClear
          onChange={(value) => dispatch(setPublisher(value))}
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
