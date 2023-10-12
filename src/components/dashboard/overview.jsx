/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import Card from "./card";
import { fetchTotal as fetchUserTotal } from "../../slices/userSlice";
import { fetchTotal as fetchContractTotal } from "../../slices/contractSlice";
import { fetchTotal as fecthBookTotal } from "../../slices/bookSlice";

function Overview() {
  const dispatch = useDispatch();
  const userTotal = useSelector((state) => state.user.total);
  const contractTotal = useSelector((state) => state.contract.total);
  const bookTotal = useSelector((state) => state.book.total);

  useEffect(() => {
    dispatch(fetchUserTotal());
    dispatch(fetchContractTotal());
    dispatch(fecthBookTotal());
  }, []);
  return (
    <div className="flex flex-wrap justify-start  p-2 gap-2">
      <Card title="Người dùng" value={userTotal} icon={<TeamOutlined />} />
      <Card title="Sách" value={bookTotal} icon={<BookOutlined />} />
      <Card
        title="Lượt thuê"
        value={contractTotal}
        icon={<SolutionOutlined />}
      />
    </div>
  );
}

export default Overview;
