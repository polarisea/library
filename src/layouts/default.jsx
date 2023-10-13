/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-cond-assign */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Avatar, Drawer, Popover, Menu } from "antd";
import { DashboardOutlined, LogoutOutlined } from "@ant-design/icons";
import Search from "../components/search";
import Auth from "../components/auth";

import bg from "../assets/bg.jpg";

import { logout } from "../slices/auth";

function DefaultLayout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [ratio, setRatio] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const menuItems = [
    {
      label: (
        <a
          onClick={() => {
            dispatch(logout());
          }}
        >
          Đăng xuất
        </a>
      ),
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
    },
  ];

  useEffect(() => {
    if (user && !user.isAdmin)
      menuItems.unshift({
        label: <a href="/dashboard">Trang quản trị</a>,
        key: "dashboard",
        icon: <DashboardOutlined />,
      });
  }, [user]);

  const popoverContent = <Menu items={menuItems}></Menu>;

  useEffect(() => {
    const bgRatio = 728 / 485;
    const screenRatio = window.innerWidth / window.innerHeight;
    if (screenRatio < bgRatio) {
      setRatio(false);
    }
  }, []);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <div className="w-full relative">
        <img src={bg} className="w-full  z-[-1]" alt="" />
        <div className="absolute top-0 px-5 w-full h-15 flex items-center justify-between pt-5">
          <a href="#" className="text-[2rem] text-white font-semibold block ">
            Library
          </a>
          {!user ? (
            <>
              <Button
                type="link"
                onClick={() => {
                  setAuthOpen(true);
                }}
              >
                Đăng nhập
              </Button>
              <Auth open={authOpen} setOpen={setAuthOpen}></Auth>
            </>
          ) : (
            <>
              <div className="max-sm:hidden">
                <Popover content={popoverContent} placement="bottomRight">
                  <button className="">
                    <span className="text-blue-600 mr-1">{user.name}</span>
                    <Avatar
                      size="large"
                      src={user ? user.picture : ""}
                      style={{
                        backgroundColor: "blue",
                      }}
                    />
                  </button>
                </Popover>
              </div>
              <div className="sm:hidden">
                <button onClick={showDrawer}>
                  <span className="text-blue-600 mr-1">{user.name}</span>
                  <Avatar
                    size="large"
                    src={user ? user.picture : ""}
                    style={{
                      backgroundColor: "blue",
                    }}
                  />
                </button>
                <Drawer
                  placement="right"
                  onClose={onClose}
                  open={openDrawer}
                  bodyStyle={{ padding: "0px" }}
                >
                  <Menu items={menuItems}></Menu>
                </Drawer>
              </div>
            </>
          )}
        </div>
        <div
          className={`absolute  left-[50vw] translate-x-[-50%] translate-y-[-50%] ${
            ratio ? "top-[50vh]" : "top-1/2"
          }  `}
        >
          <Search />
        </div>
      </div>
      <>{children}</>
      <div className="w-full mt-5 h-[15rem] bg-blue-500"></div>
    </>
  );
}

export default DefaultLayout;
