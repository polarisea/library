/* eslint-disable react/prop-types */
import { Avatar } from "antd";
function Card({ title, value, icon }) {
  return (
    <div className="w-[15rem] h-[10rem] bg-green-200 rounded-[1rem] flex flex-row">
      <span className="px-5 flex justify-center items-center">
        <Avatar size={50} icon={icon} className="m-auto " />
      </span>
      <div className="flex justify-center items-center flex-col flex-1">
        <span className="font-medium text-[1.75rem]">{value}</span>
        <span className="text-[0.85rem]">{title}</span>
      </div>
    </div>
  );
}

export default Card;
