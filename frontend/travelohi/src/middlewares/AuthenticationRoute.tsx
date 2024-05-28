import { Route, Routes, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserContext";
import { useEffect } from "react";
import { IMenu, MenuList } from "../setting/MenuList";
import Navbar from "../components/main/Navbar";

function AuthenticationRoute() {
  const { getUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user?.token === undefined) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {MenuList.map((menu: IMenu, index) => (
          <Route key={index} path={menu.path} element={menu.element} />
        ))}
      </Routes>
    </>
  );
}

export default AuthenticationRoute;
