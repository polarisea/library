/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button, Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Management from "./management";
import { vnDate } from "../../utils/date";
import { ROLE_TYPES } from "../../constants";

import {
  setSearch,
  fetchTotal as fetchUserTotal,
  fetchUsers,
} from "../../slices/userSlice";

const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (item) => item,
    fixed: "left",
  },
  {
    title: "Ảnh",
    dataIndex: "picture",
    key: "picture",
    render: (item) => <Avatar size="default" src={item ? item : ""} />,
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    render: (item) => ROLE_TYPES[item].title,
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (item) => vnDate(item),
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

function UserManagement() {
  const dispatch = useDispatch();
  const userTotal = useSelector((state) => state.user.total);
  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.loading);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total: userTotal,
    },
  });

  const data = users
    ? users.map((user, index) => ({ ...user, key: index }))
    : [];

  useEffect(() => {
    dispatch(fetchUserTotal());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: userTotal,
      },
    });
  }, [userTotal]);

  return (
    <Management
      columns={columns}
      total={userTotal}
      data={data}
      loading={loading}
      fetchDataAction={fetchUsers}
      fetchTotalAction={fetchUserTotal}
      setSearchAction={setSearch}
    ></Management>
  );
}

export default UserManagement;
