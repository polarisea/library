/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  App,
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
} from "../slices/book";
import { DEFAULT_COVER_URL } from "../constants";

import { setTab } from "../slices/homeSlice";
import { createContract, setLastAction } from "../slices/contract";

const { RangePicker } = DatePicker;
const tabTokens = {
  cardBg: "rgba(255, 255, 0, 1)",
  itemSelectedColor: "#1677ff",
  titleFontSize: 20,
  itemColor: "(0, 0, 0, 0.88)",
  colorBorder: "#d9d9d9",
  colorBgContainer: "#ffffff",
  colorBorderSecondary: "#f0f0f0",
};

function BookModal({ book, closeModal }) {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.contract.loading);
  const lastAction = useSelector((state) => state.contract.lastAction);
  const error = useSelector((state) => state.contract.error);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const items = useMemo(() => {
    return (
      book && [
        {
          key: "count",
          label: "Giới thiệu",
          children: <h1>{book.description}</h1>,
        },
        {
          key: "createdAt",
          label: "Lịch sử",
          children: (
            <ContractHistory book={book._id} removedColumns={["book"]} />
          ),
        },
      ]
    );
  }, [book]);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "createContract") {
        dispatch(setLastAction(null));
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Đặt lịch hẹn không thành không",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Đặt lịch hẹn thành không (chờ duyệt)",
          });
          setOpen(false);
        }
      }
    }
  }, [loading]);

  const handleOk = () => {
    if (from && to) {
      dispatch(
        createContract({
          from,
          to,
          book: book._id,
          indexedContent: `${book.name} ${user.name}`,
        })
      );
      return;
    }
    notification.error({
      message: "Cảnh báo",
      description: "Thời gian không hợp lệ",
    });
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
      })
    );
    dispatch(
      fetchTotal({
        publisher: null,
        author: null,
        category: null,
        search: null,
        [label]: value,
      })
    );
  }

  return (
    <>
      <div className="w-full  bg-white p-2 flex mb-2 flex-wrap justify-center">
        <div className="w-[10rem] h-[14rem] relative">
          <img
            src={book.cover ? book.cover : DEFAULT_COVER_URL}
            className="h-full w-full"
            alt=""
          />
          <span
            className="absolute w-full  text-center font-semibold text-[1rem] bottom-0 text-white"
            style={{
              backgroundColor:
                book.borrowedCount < book.count ? "green" : "red",
            }}
          >
            {book.borrowedCount < book.count ? "Sẵn sàng" : "Hết sách"}
          </span>
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
                <span className="flex flex-wrap gap-1">
                  {book.authors.map((v, i) => (
                    <Tag key={i}>
                      <button
                        onClick={() => {
                          changeTab(setAuthor(v), {
                            label: "author",
                            value: v,
                          });
                        }}
                      >
                        {v}
                      </button>
                    </Tag>
                  ))}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Thể loại">
                <span className="flex flex-wrap gap-1">
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
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Nhà xuất bản">
                <span className="flex flex-wrap gap-1">
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
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Lượt mượn: ">
                {book.contracts}
              </Descriptions.Item>
            </Descriptions>
          </ConfigProvider>
          <Button
            className="remove-all"
            type="primary"
            onClick={() => setOpen(true)}
            disabled={user && book.borrowedCount < book.count ? false : true}
          >
            Đặt lịch mượn
          </Button>

          <Modal
            title="Chọn thời gian"
            open={open}
            onOk={handleOk}
            confirmLoading={loading}
            onCancel={() => setOpen(false)}
            okText="Đặt lịch"
            okType="primary"
            destroyOnClose={true}
          >
            <RangePicker format={vnDate} onChange={onTimeChange} showTime />
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
