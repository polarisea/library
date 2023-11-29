/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, ConfigProvider, Tabs } from "antd";

import { fetchNotifies, fetchTotal } from "../slices/notify";

import Notify from "./notify";
import { ClockCircleOutlined } from "@ant-design/icons";

function NotifyForm({ bookId }) {
  const dispatch = useDispatch();
  const notifies = useSelector((state) => state.notify.notifies);
  const total = useSelector((state) => state.notify.total);
  const notify = useSelector((state) => state.notify.notify);
  const user = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [activeKey, setActiveKey] = useState("1");

  const tabItems = useMemo(() => {
    return [
      {
        key: "1",
        label: <span className="font-semibold">Thông báo</span>,
        children: (
          <>
            {notifies.map((notify) => (
              <Notify
                title={notify.title}
                content={notify.content}
                createdAt={notify.createdAt}
                key={notify._id}
              />
            ))}
            <span className="mt-5 block">
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
                  current={page}
                  total={total}
                  pageSize="6"
                  showSizeChanger={false}
                  onChange={(page) => {
                    setPage(page);
                    let receiver = "normal";
                    if (user) {
                      receiver = user._id;
                    }
                    dispatch(fetchNotifies({ page: page - 1, receiver }));
                  }}
                />
              </ConfigProvider>
            </span>
          </>
        ),
      },
      {
        key: "2",
        label: <span className="font-semibold">Nội dung</span>,
        children: (
          <>
            <h2 className="font-semibold text-[1.3rem] leading-none">
              {notify?.title}
            </h2>
            <span className="font-thin text-[0.8rem] w-full block text-end border-b-[1px] ">
              <ClockCircleOutlined />
              &nbsp;
              {notify?.createdAt}
            </span>
            <p>{notify?.content}</p>
          </>
        ),
      },
    ];
  }, [notifies, notify]);

  useEffect(() => {
    let receiver = null;
    if (user) {
      receiver = user._id;
    }
    dispatch(fetchNotifies({ receiver, page: 0 }));
    dispatch(fetchTotal({ receiver }));
  }, []);

  useEffect(() => {
    if (notify) setActiveKey("2");
  }, [notify]);

  return (
    <Tabs
      defaultActiveKey="1"
      activeKey={activeKey}
      onChange={(e) => {
        setActiveKey(e);
      }}
      items={tabItems}
      centered
      size="large"
    />
  );
}

export default NotifyForm;
