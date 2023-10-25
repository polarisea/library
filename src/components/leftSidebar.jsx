/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Menu, Button } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { fetchMe, logout } from "../slices/auth";

import { PICTURE_HOST } from "../constants";

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
  getItem(<NavLink to="/dashboard">Tổng quan</NavLink>, "overview"),
  getItem(
    <NavLink to="/dashboard/user-management">Quản lý người dùng</NavLink>,
    "user-management"
  ),
  getItem(
    <NavLink to="/dashboard/book-management">Quản lý sách</NavLink>,
    "book-management"
  ),
  getItem(
    <NavLink to="/dashboard/contract-management">Mượn & trả sách</NavLink>,
    "contract-management"
  ),
];

function LeftSidebar({ setSlideOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchMe());
    setSelectedItem(location.pathname.split("/")[2] || "overview");
  }, []);

  return (
    <div className=" bg-[rgb(0,21,41)] min-h-[100vh] h-full flex flex-col justify-between items-center pb-5">
      <span>
        <div className="flex items-center flex-col my-5">
          <Avatar
            size={50}
            src={`${PICTURE_HOST}/${user?.picture}`}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "gray",
            }}
          />
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
          selectedKeys={selectedItem}
          mode="inline"
          items={items}
          onSelect={({ key }) => {
            setSelectedItem(key);
            setSlideOpen(false);
          }}
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
