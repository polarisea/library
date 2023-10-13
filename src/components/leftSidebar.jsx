/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Menu, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { fetchMe, logout } from "../slices/auth";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(<NavLink to="/dashboard">Tổng quan</NavLink>, "1"),
  getItem(
    <NavLink to="/dashboard/user-management">Quản lý người dùng</NavLink>,
    "2",
  ),
  getItem(<NavLink to="/dashboard/book-management">Quản lý sách</NavLink>, "3"),
];

function LeftSidebar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchMe());
  }, []);

  return (
    <div className=" bg-[rgb(0,21,41)] min-h-[100vh] h-full flex flex-col justify-between items-center pb-5">
      <span>
        <div className="flex items-center flex-col my-5">
          <Avatar size={50} src={user ? user.picture : ""} />
          <span className="text-white font-semibold">
            {" "}
            {user ? user.name : ""}
          </span>
        </div>
        <Menu
          theme="dark"
          style={{
            width: 256,
          }}
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </span>
      <NavLink to="/">
        <Button
          danger
          type="link"
          icon={<LogoutOutlined />}
          onClick={() => {
            dispatch(logout());
          }}
        >
          Đăng xuất
        </Button>
      </NavLink>
    </div>
  );
}

export default LeftSidebar;
