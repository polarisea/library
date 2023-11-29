/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { App, Input, Button, Table, Modal, Popconfirm, Select } from "antd";
import NotifyForm from "./notifyForm";
import AddButton from "../addButton";

import {
  setSearch,
  setLastAction,
  fetchTotal as fetchBookTotal,
  fetchBooks,
  deleteBook,
} from "../../slices/book";

import { fetchNotifies, fetchTotal, deleteNotify } from "../../slices/notify";

import { DEFAULT_COVER_URL, BOOK_STATUS } from "../../constants";

function NotifyManagement() {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const notifies = useSelector((state) => state.notify.notifies);
  const notifyTotal = useSelector((state) => state.notify.total);
  const lastAction = useSelector((state) => state.notify.lastAction);
  const error = useSelector((state) => state.notify.error);
  const loading = useSelector((state) => state.notify.loading);

  const [editMode, setEditMode] = useState("add");
  const [selectedBook, setSelectedBook] = useState({});

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total: notifyTotal,
      simple: true,
    },
  });

  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(() => {
    return [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        render: (item) => item,
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        render: (item) => item,
      },
      {
        title: "Người nhận",
        dataIndex: "receiver",
        key: "receiver",
        render: (item) => (item ? item.name : "Tất cả"),
      },

      {
        title: "",
        dataIndex: "_id",
        key: "_id",
        width: 175,
        fixed: "right",
        render: (item) => (
          <div className="flex gap-1">
            <Popconfirm
              title="Xóa sách"
              description="Bạn chắc chắc muốn xóa thông báo này?"
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
  }, [notifies]);

  const data = useMemo(() => {
    return notifies.map((notify, index) => ({ ...notify, key: index }));
  }, [notifies]);

  useEffect(() => {
    dispatch(fetchTotal());
    dispatch(fetchNotifies({ page: 0 }));
  }, []);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "createNotify") {
        dispatch(setLastAction(null));
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Tạo thông báo thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Tạo thông báo thành công",
            placement: "topRight",
          });
          dispatch(fetchNotifies({ page: 0 }));
          setModalOpen(false);
        }
      }
      if (lastAction == "deleteNotify") {
        dispatch(setLastAction(null));
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Xóa thông báo thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Xóa thông báo thành công",
            placement: "topRight",
          });
          dispatch(fetchNotifies({ page: 0 }));
          // setModalOpen(false);
        }
      }
    }
  }, [loading]);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: notifyTotal,
      },
    });
  }, [notifyTotal]);

  function handleTableChange(pagination) {
    setTableParams({
      pagination,
    });
    dispatch(fetchNotifies({ page: pagination.current - 1 }));
  }

  function onFilter(overwrite) {
    dispatch(fetchBookTotal({ search: keyword, ...overwrite }));
    dispatch(fetchBooks({ search: keyword, ...overwrite }));
  }

  function onDelete(notifyId) {
    console.log("On delete");
    dispatch(deleteNotify(notifyId));
  }

  return (
    <>
      <Modal
        title={editMode == "add" ? "Thêm thông báo" : "Sửa thông báo"}
        open={modalOpen}
        confirmLoading={loading}
        onCancel={() => {
          setModalOpen(false);
        }}
        footer={null}
        destroyOnClose={true}
      >
        <NotifyForm
          closeModal={setModalOpen}
          mode={editMode}
          book={selectedBook}
        />
      </Modal>
      <div className="px-2 max-lg:pr-0 pb-0  max-lg:w-[100vw]  flex flex-col h-[calc(100vh-45.5px)]">
        <span className="flex  justify-between   mb-2 w-full flex-wrap gap-1 max-lg:justify-end pr-1">
          <span className="flex justify-start gap-2 max-lg:w-full  flex-wrap">
            <span className="w-[20rem] max-lg:w-full">
              {/* <Input
                placeholder="Tìm kiếm..."
                value={keyword}
                size="large"
                onPressEnter={onFilter}
                onChange={(value) => setKeyword(value.target.value)}
              /> */}
            </span>
            {/* <Select
              size="large"
              allowClear
              className="w-[20rem] max-lg:w-[95%]"
              placeholder="Vai trò"
            /> */}
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

export default NotifyManagement;
