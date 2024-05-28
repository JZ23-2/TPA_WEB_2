import AddFlight from "../pages/admin/AddFlight";
import AddHotels from "../pages/admin/AddHotels";
import AddPromo from "../pages/admin/AddPromo";
import AddRoom from "../pages/admin/AddRoom";
import ManageFlight from "../pages/admin/ManageFlight";
import ManageHotel from "../pages/admin/ManageHotel";
import ManagePromo from "../pages/admin/ManagePromo";
import ManageRoom from "../pages/admin/ManageRoom";
import ManageUser from "../pages/admin/ManageUser";
import SendNewletter from "../pages/admin/SendNewletter";

export interface IAdminMenu {
  element: JSX.Element;
  name: string;
  path: string;
}

export const AdminList: IAdminMenu[] = [
  {
    element: <AddFlight />,
    name: "AddFlight",
    path: "/add-flight-page",
  },
  {
    element: <AddHotels />,
    name: "AddHotel",
    path: "/add-hotel-page",
  },
  {
    element: <AddPromo />,
    name: "AddPromo",
    path: "/add-promo-page",
  },
  {
    element: <ManageUser />,
    name: "ManageUser",
    path: "/manage-user-page",
  },
  {
    element: <SendNewletter />,
    name: "SeneNewLetter",
    path: "/send-newletter-page",
  },
  {
    element: <ManagePromo />,
    name: "ManagePromo",
    path: "/manage-promo-page",
  },
  {
    element: <ManageFlight />,
    name: "ManageFlight",
    path: "/manage-flight-page",
  },
  {
    element: <ManageHotel />,
    name: "ManageHotel",
    path: "/manage-hotel-page",
  },
  {
    element: <ManageRoom />,
    name: "ManageRoom",
    path: "/manage-room-page",
  },
  {
    element: <AddRoom />,
    name: "AddRoom",
    path: "/add-room-page",
  },
];
