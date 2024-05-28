import { Route, Routes, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserContext";
import { useEffect } from "react";
import Navbar from "../components/main/Navbar";
import { AdminList, IAdminMenu } from "../setting/AdminMenuList";

function AdminRoute() {
  const { getUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user?.token === undefined) {
      navigate("/");
    } else if (user.role !== "Admin") {
      navigate("/home-page");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {AdminList.map((menu: IAdminMenu, index) => (
          <Route key={index} path={menu.path} element={menu.element} />
        ))}
      </Routes>
    </>
  );
}

export default AdminRoute;
