import { useSelector } from "react-redux";
import { Button } from "antd";
import Management from "./management";
import AddBookForm from "./addBookForm";

import {
  setSearch,
  fetchTotal as fetchBookTotal,
  fetchBooks,
} from "../../slices/bookSlice";

// import { ROLE_TYPES } from "../../constants";

const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (item) => item,
    fixed: "left",
  },
  {
    title: "Tác giả",
    dataIndex: "authors",
    key: "authors",
    render: (item) => {
      let authors = item
        ? item.reduce((t, v) => t + (t.length > 0 ? " - " : "") + v.name, "")
        : "";

      return authors;
    },
  },
  {
    title: "Thể loại",
    dataIndex: "categories",
    key: "categories",
    render: (item) => {
      let categories = item
        ? item.reduce((t, v) => t + (t.length > 0 ? " - " : "") + v.title, "")
        : "";

      return categories;
    },
  },
  {
    title: "Số lượng",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "Đánh giá",
    dataIndex: "votes",
    key: "votes",
  },
  {
    title: "Lượt mượn",
    dataIndex: "contracts",
    key: "contracts",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: 175,
    fixed: "right",
    render: () => (
      <div>
        <Button type="primary">Sửa</Button>
        <Button className="ml-2" danger>
          Xóa
        </Button>
      </div>
    ),
  },
];

function BookManagement() {
  //   const dispatch = useDispatch();
  const userTotal = useSelector((state) => state.book.total);
  const books = useSelector((state) => state.book.books);
  const loading = useSelector((state) => state.book.loading);

  const data = books
    ? books.map((book, index) => ({ ...book, key: index }))
    : [];

  //   useEffect(() => {
  //     dispatch(fetchUserTotal());
  //     dispatch(fetchUsers());
  //   }, []);

  return (
    <Management
      columns={columns}
      total={userTotal}
      data={data}
      loading={loading}
      fetchDataAction={fetchBooks}
      fetchTotalAction={fetchBookTotal}
      setSearchAction={setSearch}
      addForm={<AddBookForm />}
    ></Management>
  );
}

export default BookManagement;
