/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import LeftSidebar from "../components/leftSidebar";
import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
function AdminLayout({ children }) {
  const [slideOpen, setSlideOpen] = useState();
  return (
    <div className="flex relative">
      <span
        className={`relative animate-left ${
          slideOpen ? "max-lg:left-0" : "max-lg:left-[-256px]"
        }`}
      >
        <LeftSidebar setSlideOpen={setSlideOpen} />
      </span>
      <div
        className={`flex-1 h-[100vh] lg:w-[calc(100vw-256px)]   relative animate-left flex flex-col  ${
          slideOpen ? "max-lg:left-[0]" : "max-lg:left-[-256px]"
        }`}
      >
        <div className="flex justify-between items-center px-2 my-1">
          <span className="lg:hidden">
            <Button
              icon={<MenuOutlined />}
              onClick={() => {
                setSlideOpen(!slideOpen);
              }}
            ></Button>
          </span>
          <h1 className="text-[1.75rem] font-semibold   max-lg:hidden">
            Chào mừng trở lại
          </h1>
          <NavLink to="/">
            <span className=" text-[1.2rem] font-semibold text-blue-600">
              Trang chủ
            </span>
          </NavLink>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
