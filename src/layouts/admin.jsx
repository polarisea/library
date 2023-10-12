/* eslint-disable react/prop-types */

import LeftSidebar from "../components/leftSidebar";
function AdminLayout({ children }) {
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1 h-[100vh] ">
        <h1 className="text-[2rem] font-semibold mt-5 mx-5">
          Chào mừng trở lại
        </h1>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
