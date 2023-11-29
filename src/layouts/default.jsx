import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { App, Button, Avatar, Popover, Menu, Modal } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  LockOutlined,
  ProfileOutlined,
  BellFilled,
} from "@ant-design/icons";

import { ROLES } from "../constants";

import Search from "../components/search";
import Auth from "../components/auth";
import Profile from "../components/profile";
import ChangePassword from "../components/changePassword";
import NotifyForm from "../components/notifyForm";

import bg from "../assets/bg1.png";

import { logout } from "../slices/auth";
import { PICTURE_HOST } from "../constants";

import { setUserId, setOpen } from "../slices/profile";
import { setNotify } from "../slices/notify";

function DefaultLayout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isRoot = useSelector((state) => state.auth.isRoot);
  const [ratio, setRatio] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const popoverContent = useMemo(() => {
    return (
      <Menu>
        {(isAdmin || isRoot) && (
          <Menu.Item
            icon={<DashboardOutlined />}
            key="dashboard"
            onClick={() => {}}
          >
            <a href="/dashboard">Trang quản trị</a>
          </Menu.Item>
        )}
        <Menu.Item
          icon={<ProfileOutlined />}
          onClick={() => {
            dispatch(setUserId(user._id));
            dispatch(setOpen(true));
          }}
        >
          Hồ sơ của tôi
        </Menu.Item>
        {/* <Menu.Item
          icon={<LockOutlined />}
          onClick={() => {
            setChangePassOpen(true);
          }}
        >
          Đổi mật khẩu
        </Menu.Item> */}
        <Menu.Item
          icon={<LogoutOutlined />}
          onClick={() => {
            dispatch(logout());
          }}
          danger
        >
          Đăng xuất
        </Menu.Item>
      </Menu>
    );
  }, [isAdmin, isRoot, user]);

  useEffect(() => {
    const bgRatio = 728 / 485;
    const screenRatio = window.innerWidth / window.innerHeight;
    if (screenRatio < bgRatio) {
      setRatio(false);
    }
  }, []);

  return (
    <>
      <Modal
        zIndex={1031}
        open={notifyOpen}
        onCancel={() => {
          setNotifyOpen(false);
          dispatch(setNotify(null));
        }}
        footer={null}
        destroyOnClose={true}
      >
        <NotifyForm />
      </Modal>
      <div className="w-full relative ">
        <img src={bg} className="w-full  z-[-1]" alt="" />
        <div className="absolute top-0 px-5 w-full h-15 flex items-center justify-between pt-5">
          <a href="/" className="text-[2rem] text-white font-semibold block ">
            Library
          </a>
          <span className="flex">
            <button
              onClick={(e) => {
                setNotifyOpen(true);
              }}
            >
              <BellFilled style={{ color: "white", fontSize: "1.5rem" }} />
            </button>

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
                <Auth open={authOpen} setOpen={setAuthOpen} />
              </>
            ) : (
              <>
                <div className="ml-2">
                  <Popover content={popoverContent} placement="bottomRight">
                    <button className="flex items-center">
                      <span className="font-bold text-white mr-1">
                        {user.name}
                      </span>
                      <span
                        className="border-[2px] rounded-[10rem] w-[44px] block "
                        style={{ borderColor: ROLES[user?.role]?.color }}
                      >
                        <Avatar
                          size="large"
                          src={user ? `${PICTURE_HOST}/${user.picture}` : ""}
                          icon={<UserOutlined />}
                        />
                      </span>
                    </button>
                  </Popover>
                </div>
                <Profile />
                {/* <ChangePassword
                  open={changePassOpen}
                  setOpen={setChangePassOpen}
                /> */}
              </>
            )}
          </span>
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
