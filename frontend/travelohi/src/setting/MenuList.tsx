import HiaiPage from "../pages/AI/HiaiPage";
import ViewProfile from "../pages/User/ViewProfile";
import CartPage from "../pages/cart/CartPage";
import FlightDetailPage from "../pages/flight/FlightDetailPage";
import FlightPage from "../pages/flight/FlightPage";
import GamePage from "../pages/game/GamePage";
import HistoryPage from "../pages/history/HistoryPage";
import HomePage from "../pages/home/HomePage";
import HotelPage from "../pages/hotel/HotelPage";
import ReviewPage from "../pages/review/ReviewPage";
import RoomDetail from "../pages/room/RoomDetail";
import SocketPage from "../pages/socket/SocketPage";
import TicketPage from "../pages/ticket/TicketPage";

export interface IMenu {
  name: string;
  path: string;
  element: JSX.Element;
}

export const MenuList: IMenu[] = [
  {
    element: <HomePage />,
    name: "Home",
    path: "/home-page",
  },
  {
    element: <FlightPage />,
    name: "Flight",
    path: "/flight-page",
  },
  {
    element: <ViewProfile />,
    name: "Profile",
    path: "/view-profile",
  },
  {
    element: <FlightDetailPage />,
    name: "Flight Detail",
    path: "/flight-detail-page/:id",
  },
  {
    element: <HotelPage />,
    name: "Hotel",
    path: "/hotel-page",
  },
  {
    element: <RoomDetail />,
    name: "Room Detail",
    path: "/room-detail-page/:id",
  },
  {
    element: <HistoryPage />,
    name: "History",
    path: "/history-page",
  },
  {
    element: <TicketPage />,
    name: "Ticket",
    path: "/ticket-page",
  },
  {
    element: <CartPage />,
    name: "Cart",
    path: "/cart-page",
  },
  {
    element: <GamePage />,
    name: "Game",
    path: "/game-page",
  },
  {
    element: <SocketPage />,
    name: "Socket",
    path: "/socket-page",
  },
  {
    element: <ReviewPage />,
    name: "Review",
    path: "/review-page/:id",
  },
  {
    element: <HiaiPage />,
    name: "AI",
    path: "/ai-page",
  },
];
