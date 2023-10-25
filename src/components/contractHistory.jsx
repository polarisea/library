/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Avatar } from "antd";

import {
  fetchContractHistory,
  fetchTotalContractHistory,
} from "../slices/book";
function ContractHistory({ book }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.book.loading);
  const contractHistory = useSelector((state) => state.book.contractHistory);
  const totalContractHistory = useSelector(
    (state) => state.book.totalContractHistory,
  );
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total: totalContractHistory,
      showSizeChanger: false,
    },
  });

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "book",
      key: "book",
      render: (item) => <a>{item.name}</a>,
    },
    {
      title: "Người mượn",
      dataIndex: "user",
      key: "user",
      render: (item) => (
        <button className="">
          <Avatar size="default" src={item ? item.picture : ""} />
          <span className="text-gray-600 ml-2">{item.name}</span>
        </button>
      ),
    },
  ];
  const data = contractHistory
    ? contractHistory.map((contract, index) => ({
        key: index,
        book: contract.book,
        user: contract.user,
      }))
    : [];

  useEffect(() => {
    dispatch(fetchTotalContractHistory({ book }));
    dispatch(fetchContractHistory({ book }));
  }, [book]);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: totalContractHistory,
      },
    });
  }, [totalContractHistory]);
  const handleTableChange = (pagination) => {
    setTableParams({
      pagination,
    });
    dispatch(fetchContractHistory({ book, page: pagination.current - 1 }));
  };
  return (
    <>
      {contractHistory ? (
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
