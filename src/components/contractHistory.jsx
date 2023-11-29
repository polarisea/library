/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Avatar } from "antd";

import { fetchContracts, fetchTotal } from "../slices/contract";
import { CONTRACTS } from "../constants";
import { vnDate } from "../utils/date";

import { setUserId, setOpen } from "../slices/profile";

function ContractHistory({ book, user, removedColumns, closeBookModal }) {
  const dispatch = useDispatch();
  const contracts = useSelector((state) => state.contract.contracts);
  const total = useSelector((state) => state.contract.total);
  const loading = useSelector((state) => state.contract.loading);
  const isLogin = useSelector((state) => state.auth.user);
  // const error = useSelector((state) => state.contract.error);
  // const lastAction = useSelector((state) => state.contract.lastAction);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total,
      showSizeChanger: false,
      simple: true,
    },
  });

  const columns = useMemo(() => {
    if (removedColumns) {
      return [
        {
          title: "Tên sách",
          dataIndex: "book",
          key: "book",
          render: (item) => <a>{item?.name}</a>,
        },
        {
          title: "Người mượn",
          dataIndex: "user",
          key: "user",
          render: (item) => (
            <button
              onClick={(e) => {
                if (isLogin) {
                  closeBookModal();
                  dispatch(setUserId(item?._id));
                  dispatch(setOpen(true));
                }
              }}
            >
              <span className="text-blue-600">{item?.name || "Đã bị xóa"}</span>
            </button>
          ),
        },
        {
          title: "Tình trạng",
          dataIndex: "status",
          key: "status",
          render: (item) => (
            <span style={{ color: CONTRACTS[item]?.color }}>
              {CONTRACTS[item]?.title}
            </span>
          ),
        },
        {
          title: "Thời gian",
          dataIndex: "createdAt",
          key: "createdAt",
          render: (item) => vnDate(item),
        },
      ].filter((item) => !removedColumns.includes(item?.key));
    }
    return [];
  }, [removedColumns, isLogin]);

  const data = useMemo(() => {
    return contracts
      ? contracts.map((contract, index) => ({
          key: index,
          book: contract.book,
          user: contract.user,
          status: contract.status,
          createdAt: contract.createdAt,
        }))
      : [];
  }, [contracts]);

  useEffect(() => {
    dispatch(fetchContracts({ book, user }));
    dispatch(fetchTotal({ book, user }));
    console.log("User: ", user);
  }, [book, user]);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total,
      },
    });
  }, [total]);

  const handleTableChange = (pagination) => {
    setTableParams({
      pagination,
    });
    dispatch(fetchContracts({ book, user, page: pagination.current - 1 }));
  };
  return (
    <>
      {contracts ? (
        <Table
          pagination={tableParams.pagination}
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
          loading={loading}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default ContractHistory;
