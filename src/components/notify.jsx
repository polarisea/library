/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ClockCircleOutlined } from "@ant-design/icons";
import { vnDate } from "../utils/date";

import { setNotify } from "../slices/notify";

function Notify({ title, content, createdAt }) {
  const dispatch = useDispatch();

  return (
    <div className=" text-gray-600">
      <h2
        className="hover:cursor-pointer font-semibold text-[1.1rem] active:text-blue-700 hover:text-blue-500 leading-none"
        onClick={(e) => {
          dispatch(setNotify({ title, content, createdAt: vnDate(createdAt) }));
        }}
      >
        {title}
      </h2>
      <span className="text-[0.9rem] font-thin  w-full block text-end">
        <ClockCircleOutlined />
        &nbsp;
        {vnDate(createdAt)}
      </span>
      <span className="block w-90 h-[1px]   bg-gray-300 mb-5"></span>
    </div>
  );
}

export default Notify;
