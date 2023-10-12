import { Outlet } from "react-router-dom";
import AdminLayout from "../layouts/admin";

function Dashboard() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default Dashboard;
