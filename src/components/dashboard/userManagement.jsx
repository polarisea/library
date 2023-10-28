/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import {
  App,
  Input,
  Button,
  Avatar,
  Table,
  Modal,
  Select,
  Popconfirm,
} from "antd";

import { useSelector, useDispatch } from "react-redux";

import { vnDate } from "../../utils/date";
import { ROLES, PICTURE_HOST, DEFAULT_COVER_URL } from "../../constants";

import {
  setSearch,
  setLastAction,
  fetchTotal as fetchUserTotal,
  fetchUsers,
  grantPermission,
  deleteUser,
} from "../../slices/user";

const roleOptions = [
  {
    label: "Quản trị viên",
    value: ROLES.admin.value,
  },
  {
    label: "Độc giả",
    value: ROLES.user.value,
  },
];

function UserManagement() {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const userTotal = useSelector((state) => state.user.total);
  const users = useSelector((state) => state.user.users);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);
  const lastAction = useSelector((state) => state.user.lastAction);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total: userTotal,
      simple: true,
    },
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState(null);

  const columns = useMemo(() => {
    return [
      {
        title: "Ảnh",
        dataIndex: "picture",
        key: "picture",
        render: (item) => (
          <Avatar
            size="default"
            src={item ? `${PICTURE_HOST}/${item}` : DEFAULT_COVER_URL}
          />
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (item) => item,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (item) => item,
      },
      {
        title: "Ngày sinh",
        dataIndex: "DOB",
        key: "DOB",
        render: (item) => item && vnDate(item),
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        render: (item) => ROLES[item]?.title,
      },
      {
        title: "Điện thoại",
        dataIndex: "phone",
        key: "phone",
        render: (item) => item,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        render: (item) => item,
      },
      {
        title: "Lượt mượn",
        dataIndex: "contracts",
        key: "contracts",
        render: (item) => item,
      },
      {
        dataIndex: "_id",
        key: "_id",
        width: 175,
        fixed: "right",
        render: (item) => (
          <div className="flex gap-1">
            <Button
              type="primary"
              onClick={() => {
                for (const u of users) {
                  if (u._id == item) {
                    setSelectedUser(u);
                    break;
                  }
                }
                setModalOpen(true);
              }}
            >
              Phân quyền
            </Button>
            <Popconfirm
              title="Xóa tài khoản"
              description="Bạn chắc chắc muốn xóa tài khoản này này?"
              onConfirm={() => {
                onDelete(item);
              }}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </div>
        ),
      },
    ];
  }, [users]);

  const [keyword, setKeyword] = useState(null);
  const [role, setRole] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserTotal());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "deleteUser") {
        dispatch(setLastAction(null));

        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Xóa tài khoản thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Xóa tài khoản thành công",
            placement: "topRight",
          });
          onFilter({ page: tableParams.pagination.current - 1 });
        }
      }
      if (lastAction == "grantPermission") {
        dispatch(setLastAction(null));

        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Phân quyên thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Phân quyền thành công",
            placement: "topRight",
          });
          setModalOpen(false);
          onFilter({ page: tableParams.pagination.current - 1 });
        }
      }
    }
  }, [loading]);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: userTotal,
      },
    });
  }, [userTotal]);

  const data = useMemo(() => {
    return users ? users.map((user, index) => ({ ...user, key: index })) : [];
  }, [users]);

  function handleTableChange(pagination) {
    setTableParams({
      pagination,
    });
    dispatch(
      fetchUsers({
        page: pagination.current - 1,
        search: keyword,
        role,
      })
    );
  }

  function onFilter(overwrite) {
    dispatch(fetchUserTotal({ search: keyword, role, ...overwrite }));
    dispatch(fetchUsers({ search: keyword, role, ...overwrite }));
  }

  function onGranPermission() {
    if (permission) {
      dispatch(grantPermission({ id: selectedUser._id, role: permission }));
      setPermission(null);
    }
  }

  function onDelete(userId) {
    dispatch(deleteUser(userId));
  }

  return (
    <>
      <Modal
        title="Phân quyền"
        open={modalOpen}
        confirmLoading={loading}
        onCancel={() => {
          setModalOpen(false);
        }}
        onOk={onGranPermission}
        destroyOnClose={true}
      >
        <Select
          placeholder="Lựa chọn quyền"
          style={{
            width: 200,
          }}
          value={permission}
          options={roleOptions}
          onChange={(value) => setPermission(value)}
        />
      </Modal>
      <div className="p-2 overflow-x-scroll max-lg:w-[100vw]">
        <div className="flex justify-start gap-2  mb-2 w-full flex-wrap">
          <span className="w-[20rem] max-lg:w-[95%]">
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
            value={role}
            options={roleOptions}
            allowClear
            className="w-[20rem] max-lg:w-[95%]"
            placeholder="Vai trò"
            onChange={(value) => {
              setRole(value);
              onFilter({ role: value });
            }}
          />
        </div>
        <Table
          bordered
          pagination={tableParams.pagination}
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
          loading={loading}
        />
      </div>
    </>
  );
}

export default UserManagement;
