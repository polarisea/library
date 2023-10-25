/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Pagination, ConfigProvider } from "antd";

import Book from "../components/book";

import { fetchBooks } from "../slices/book";

function BookList() {
  const dispatch = useDispatch();

  const books = useSelector((state) => state.book.books);
  const total = useSelector((state) => state.book.total);

  return (
    <>
      <div className="w-full">
        {books.map((item, index) => (
          <Book book={item} key={index}></Book>
        ))}
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                itemBg: "#fffff",
              },
            },
          }}
        >
          <Pagination
            className=" mx-auto mt-5 flex justify-center"
            defaultCurrent={1}
            total={total}
            pageSize="6"
            showSizeChanger={false}
            onChange={(page) => dispatch(fetchBooks({ page: page - 1 }))}
          />
        </ConfigProvider>
      </div>
    </>
  );
}

export default BookList;
