/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Descriptions,
  ConfigProvider,
  Tabs,
  Button,
  DatePicker,
  Modal,
  Tag,
  notification,
} from "antd";

import { vnDate } from "../utils/date";
import ContractHistory from "./contractHistory";

import {
  setSearch,
  setPublisher,
  setCategory,
  setAuthor,
  fetchBooks,
  fetchTotal,
  requestAppointment,
} from "../slices/book";
import { BOOK_STATUS, DEFAULT_COVER_URL } from "../constants";

import { setTab } from "../slices/homeSlice";

const { RangePicker } = DatePicker;

function BookModal({ book, closeModal }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.book.loading);
  const error = useSelector((state) => state.book.error);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message) => {
    api[message.type]({
      message: message.title,
      description: message.content,
      placement: "topRight",
    });
  };

  const tabTokens = {
    cardBg: "rgba(255, 255, 0, 1)",
    itemSelectedColor: "#1677ff",
    titleFontSize: 20,
    itemColor: "(0, 0, 0, 0.88)",
    colorBorder: "#d9d9d9",
    colorBgContainer: "#ffffff",
    colorBorderSecondary: "#f0f0f0",
  };

  const items = [
    {
      key: "count",
      label: "Giới thiệu",
      children: <h1>{book.description}</h1>,
    },
    {
      key: "createdAt",
      label: "Lịch sử",
      children: <ContractHistory book={book._id} />,
    },
  ];

  useEffect(() => {
    if (loading == false && open) {
      setOpen(false);
      if (!error) {
        openNotification({
          title: "Thông báo",
          type: "success",
          content: "Đặt lịch hẹn thành không (chờ duyệt)",
        });
      }
    }
  }, [loading]);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    if (from && to) {
      dispatch(requestAppointment({ from, to, book: book._id }));
      return;
    }
    openNotification({
      title: "Cảnh báo",
      type: "error",
      content: "Thời gian không hợp lệ",
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onTimeChange = (value) => {
    if (value) {
      const from = new Date(value[0].$d).toISOString();
      const to = new Date(value[1].$d).toISOString();
      setFrom(from);
      setTo(to);
      return;
    }

    setFrom(null);
    setTo(null);
  };

  function changeTab(action, { label, value }) {
    dispatch(setSearch(null));
    dispatch(setPublisher(null));
    dispatch(setAuthor(null));
    dispatch(setCategory(null));
    dispatch(action);
    dispatch(setTab("#"));
    closeModal();
    scrollTo({
      top: window.innerWidth * 0.55,
      behavior: "smooth",
    });
    dispatch(
      fetchBooks({
        publisher: null,
        author: null,
        category: null,
        search: null,
        [label]: value,
      }),
    );
    dispatch(
      fetchTotal({
        publisher: null,
        author: null,
        category: null,
        search: null,
        [label]: value,
      }),
    );
  }

  return (
    <>
      {contextHolder}
      <div className="w-full  bg-white p-2 flex mb-2 flex-wrap">
        <div className="w-[10rem] h-[15.5rem]">
          <img
            src={book.cover ? book.cover : DEFAULT_COVER_URL}
            className="h-full"
            alt=""
          />
        </div>

        <div className="flex  flex-1 flex-col px-2 justify-between">
          <ConfigProvider
            theme={{
              components: {
                Descriptions: {
                  itemPaddingBottom: 5,
                  titleMarginBottom: 0,
                },
              },
            }}
          >
            <Descriptions column={1} title={book.name}>
              <Descriptions.Item label="Tác giả">
                {book.authors.map((v, i) => (
                  <Tag key={i}>
                    <button
                      onClick={() => {
                        changeTab(setAuthor(v), { label: "author", value: v });
                      }}
                    >
                      {v}
                    </button>
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Thể loại">
                {book.categories.map((v, i) => (
                  <Tag key={i}>
                    <button
                      onClick={() => {
                        changeTab(setCategory(v), {
                          label: "category",
                          value: v,
                        });
                      }}
                    >
                      {v}
                    </button>
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà xuất bản">
                {book.publishers.map((v, i) => (
                  <Tag key={i}>
                    <button
                      onClick={() => {
                        changeTab(setPublisher(v), {
                          label: "publisher",
                          value: v,
                        });
                      }}
                    >
                      {v}
                    </button>
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Lượt mượn: ">
                {book.contracts}
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng: ">
                {
                  <span style={{ color: BOOK_STATUS[book.status].color }}>
                    {BOOK_STATUS[book.status].title}
                  </span>
                }
              </Descriptions.Item>
            </Descriptions>
          </ConfigProvider>
          <Button
            className="remove-all"
            type="primary"
            onClick={showModal}
            disabled={user ? false : true}
          >
            Đặt lịch mượn
          </Button>

          <Modal
            title="Chọn thời gian"
            open={open}
            onOk={handleOk}
            confirmLoading={loading}
            onCancel={handleCancel}
            okText="Đặt lịch"
            okType="primary"
          >
            <RangePicker format={vnDate} onChange={onTimeChange} />
          </Modal>
        </div>
        <div className=" w-full ">
          <ConfigProvider
            theme={{
              components: {
                Tabs: tabTokens,
              },
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={items}
              tabBarStyle={{
                fontWeight: 600,
                marginBottom: 0,
              }}
            ></Tabs>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default BookModal;
