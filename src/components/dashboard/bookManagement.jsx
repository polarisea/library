/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { App, Input, Button, Table, Modal, Popconfirm, Select } from "antd";
import BookForm from "./bookForm";
import AddButton from "../addButton";

import {
  setSearch,
  setLastAction,
  fetchTotal as fetchBookTotal,
  fetchBooks,
  deleteBook,
} from "../../slices/book";

import { DEFAULT_COVER_URL, BOOK_STATUS } from "../../constants";

const sortOptions = [
  {
    label: "Sắp xếp theo lượt mượn",
    value: "contracts",
  },
  {
    label: "Sắp xếp theo thời gian tạo",
    value: "createdAt",
  },
];

function BookManagement() {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const bookTotal = useSelector((state) => state.book.total);
  const books = useSelector((state) => state.book.books);
  const loading = useSelector((state) => state.book.loading);
  const error = useSelector((state) => state.book.error);
  const lastAction = useSelector((state) => state.book.lastAction);

  const [sort, setSort] = useState("contracts");
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState("add");
  const [selectedBook, setSelectedBook] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total: bookTotal,
      simple: true,
    },
  });

  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(() => {
    return [
      {
        title: "Ảnh bìa",
        dataIndex: "cover",
        key: "cover",
        render: (item) => (
          <div className="w-[5rem] h-[7rem]">
            <img
              src={item ? item : DEFAULT_COVER_URL}
              className="h-full"
              alt=""
            />
          </div>
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (item) => item,
      },
      {
        title: "Tác giả",
        dataIndex: "authors",
        key: "authors",
        render: (item) => {
          return item.join(", ");
        },
      },
      {
        title: "Thể loại",
        dataIndex: "categories",
        key: "categories",
        render: (item) => {
          return item.join(", ");
        },
      },
      {
        title: "Nhà xuất bản",
        dataIndex: "publishers",
        key: "publishers",
        render: (item) => {
          return item.join(", ");
        },
      },
      {
        title: "Số lượng",
        dataIndex: "count",
        key: "count",
        render: (item) => item,
      },
      {
        title: "Sách trong kho",
        dataIndex: "stockCount",
        key: "stockCount",
        render: (item) => item,
      },
      {
        title: "Sách đang được mượn",
        dataIndex: "borrowedCount",
        key: "borrowedCount",
        render: (item) => item,
      },
      {
        title: "Sách bị hỏng",
        dataIndex: "brokenCount",
        key: "brokenCount",
        render: (item) => item,
      },
      {
        title: "Lượt mượn",
        dataIndex: "contracts",
        key: "contracts",
      },
      {
        title: "Phí trả muộn (ngày)",
        dataIndex: "lateReturnFine",
        key: "lateReturnFine",
        render: (item) => `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      },
      {
        title: "Phí làm hỏng",
        dataIndex: "damagedBookFine",
        key: "damagedBookFine",
        render: (item) => `${item}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      },
      {
        title: "",
        dataIndex: "_id",
        key: "_id",
        width: 175,
        fixed: "right",
        render: (item) => (
          <div className="flex gap-1">
            <Button
              type="primary"
              onClick={() => {
                for (const b of books) {
                  if (b._id == item) {
                    setSelectedBook(b);
                    break;
                  }
                }
                setEditMode("edit");
                setModalOpen(true);
              }}
            >
              Cập nhật
            </Button>
            <Popconfirm
              title="Xóa sách"
              description="Bạn chắc chắc muốn xóa sách này này?"
              onConfirm={() => {
                onDelete(item);
              }}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button className="ml-2" danger>
                Xóa
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ];
  }, [books]);

  useEffect(() => {
    dispatch(fetchBookTotal());
    dispatch(fetchBooks());
  }, []);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "deleteBook") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Xóa sách thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Xóa sách thành công",
            placement: "topRight",
          });
          dispatch(fetchBooks());
        }
        dispatch(setLastAction(null));
      }
      if (lastAction == "createBook") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Thêm sách thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Thêm sách thành công",
            placement: "topRight",
          });
          dispatch(fetchBooks());
          setModalOpen(false);
        }
        dispatch(setLastAction(null));
      }
      if (lastAction == "updateBook") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Cập nhật sách thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Cập nhật sách thành công",
            placement: "topRight",
          });
          dispatch(fetchBooks());
          setModalOpen(false);
        }
        dispatch(setLastAction(null));
      }
    }
  }, [loading]);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: bookTotal,
      },
    });
  }, [bookTotal]);

  useEffect(() => {
    setData(books ? books.map((book, index) => ({ ...book, key: index })) : []);
  }, [books]);

  function handleTableChange(pagination) {
    setTableParams({
      pagination,
    });
    dispatch(fetchBooks({ page: pagination.current - 1 }));
  }

  function onFilter(overwrite) {
    dispatch(fetchBookTotal({ search: keyword, ...overwrite }));
    dispatch(fetchBooks({ search: keyword, sort, ...overwrite }));
  }

  function onDelete(bookId) {
    dispatch(deleteBook(bookId));
  }
  return (
    <>
      <Modal
        title={editMode == "add" ? "Thêm sách" : "Sửa thông tin"}
        open={modalOpen}
        confirmLoading={loading}
        onCancel={() => {
          setModalOpen(false);
        }}
        footer={null}
        destroyOnClose={true}
      >
        <BookForm
          closeModal={setModalOpen}
          mode={editMode}
          book={selectedBook}
        />
      </Modal>
      <div className="px-2 max-lg:pr-0 pb-0  max-lg:w-[100vw]  flex flex-col h-[calc(100vh-45.5px)]">
        <span className="flex  justify-between   mb-2 w-full flex-wrap gap-1 max-lg:justify-end pr-1">
          <span className="flex justify-start gap-2 max-lg:w-full  flex-wrap">
            <span className="w-[20rem] max-lg:w-full">
              <Input
                placeholder="Tìm kiếm..."
                value={keyword}
                size="large"
                onPressEnter={onFilter}
                onChange={(value) => setKeyword(value.target.value)}
              />
            </span>
            <Select
              size="large"
              value={sort}
              options={sortOptions}
              className="w-[20rem] max-lg:w-full"
              placeholder="Sắp xếp theo"
              onChange={(value) => {
                setSort(value);
                onFilter({ sort: value });
              }}
            />
          </span>
          <AddButton
            onClick={() => {
              setSelectedBook({});
              setEditMode("add");
              setModalOpen(true);
            }}
          />
        </span>
        <div className="overflow-x-scroll flex-1 ">
          <Table
            bordered
            pagination={tableParams.pagination}
            columns={columns}
            dataSource={data}
            onChange={handleTableChange}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}

export default BookManagement;
