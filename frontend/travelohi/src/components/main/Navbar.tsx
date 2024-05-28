import { Link, useNavigate } from "react-router-dom";
import indo_logo from "../../assets/indo-logo.png";
import america_logo from "../../assets/america-logo.png";
import dark_remove from "../../assets/dark-remove.png";
import white_remove from "../../assets/white_remove.png";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import "./navbar.scss";
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { useUserAuth } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import sun_logo from "../../assets/sun.png";
import moon_logo from "../../assets/moon.png";
import axios from "axios";

function Navbar() {
  const [language, setLanguage] = useState<string>("IDN");
  const [recommendationSearch, setRecommendationSearch] = useState<
    { searchKeyword: string }[]
  >([]);
  const [userHistory, setUserHistory] = useState<{ searchKeyword: string }[]>(
    []
  );
  console.log(language);
  const { user } = useUserAuth();
  const { changeTheme } = useTheme();
  const theme = localStorage.getItem("theme");
  const idnRef = useRef(null);
  const usaRef = useRef(null);
  const navigate = useNavigate();
  const currLanguage = localStorage.getItem("language");
  const [display, setDisplay] = useState<string>("none");
  const searchRef = useRef<HTMLInputElement>(null);

  const handleLanguage = (ref: RefObject<HTMLParagraphElement>) => {
    const languageText = ref.current?.textContent;
    const currlanguage = localStorage.getItem("language");
    if (languageText === "IDN") {
      setLanguage(() => currlanguage!);
      localStorage.setItem("language", "IDN");
    } else {
      setLanguage(() => currlanguage!);
      localStorage.setItem("language", "USA");
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var search = formData.get("search") as string;
    axios
      .post("http://localhost:8080/api/search/get-search", {
        SearchKeyword: search,
        UserID: user?.userID,
      })
      .then((res) => {
        console.log(res.data);
      });

    axios
      .get("http://localhost:8080/api/hotel/get-hotel-by-search", {
        params: { keyword: search },
      })
      .then((res) => {
        console.log(res.data);
      });

    axios
      .get("http://localhost:8080/api/search/get-flight-by-search", {
        params: { keyword: search },
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/search/get-recommendation-search")
      .then((res) => {
        setRecommendationSearch(res.data);
      });
  }, []);
  const userID = user?.userID;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/search/get-user-history", {
        params: { UserID: userID },
      })
      .then((res) => {
        setUserHistory(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const handleClick = () => {
    if (display === "none") {
      setDisplay("block");
    } else {
      setDisplay("none");
    }
  };

  const handleSearchClick = (value: string) => {
    if (searchRef.current) {
      searchRef.current.value = value;
    }
  };

  const logout = () => {
    navigate("/");
    localStorage.clear();
  };

  return (
    <>
      <nav className="navbar flex space-evenly">
        <div>
          <Link to={"/"}>
            {theme === "dark" ? (
              <img className="w-30 h-16" src={dark_remove} alt="white_logo" />
            ) : (
              <img className="w-30 h-16" src={white_remove} alt="white_logo" />
            )}
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <div className="relative">
            <form onSubmit={handleSearch}>
              <input
                ref={searchRef}
                onClick={handleClick}
                type="text"
                placeholder="Search..."
                className="border search-input w-120"
                name="search"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute left-1 top-0 mt-3 mr-5 search-icon"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          {display === "block" && (
            <div className="search-recommendation">
              {userHistory && (
                <div>
                  <p className="my-3 color-primary">History</p>
                  {userHistory.map((history, index) => (
                    <div
                      className="my-2 p-container"
                      key={index}
                      onClick={() => handleSearchClick(history.searchKeyword)}
                    >
                      <p>{history.searchKeyword}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="my-3 color-primary">Recommendation Search</p>
              {recommendationSearch.map((search, index) => (
                <div
                  className="my-2 p-container"
                  key={index}
                  onClick={() => handleSearchClick(search.searchKeyword)}
                >
                  <p>{search.searchKeyword}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex justify-center items-center gap-2 mr-2 cursor-pointer">
            <FaShoppingCart className="cart-icon" />
            <Link to={"/cart-page"} className="color-primary decoration">
              Cart
            </Link>
          </div>
          <div className="dropdown gap-1 cursor-pointer">
            {currLanguage === "IDN" ? (
              <div className="flex justify-center items-center gap-1">
                <img className="w-10 h-10" src={indo_logo} alt="indo-logo" />
                <div className="cursor-pointer color-primary">IDN | IDR</div>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-1">
                <img className="w-10 h-10" src={america_logo} alt="indo-logo" />
                <div className="cursor-pointer color-primary">USA | USD</div>
              </div>
            )}
            <ul className="dropdown-menu">
              <li onClick={() => handleLanguage(idnRef)}>
                <div className="flex items-center gap-1 language-container">
                  <img className="w-8 h-8" src={indo_logo} alt="indo_logo" />
                  <p ref={idnRef}>IDN</p>
                </div>
              </li>
              <li onClick={() => handleLanguage(usaRef)}>
                <div className="flex items-center gap-1 language-container">
                  <img
                    className="w-8 h-8"
                    src={america_logo}
                    alt="america_logo"
                  />
                  <p ref={usaRef}>USA</p>
                </div>
              </li>
            </ul>
            <IoMdArrowDropdown />
          </div>
          <div className="dropdown">
            <p className="color-primary">Payment</p>
            <ul className="dropdown-menu">
              <li>
                <Link className="link" to={"/home-page"}>
                  Credit Card
                </Link>
                <Link className="link" to={"/home-page"}>
                  E Wallet
                </Link>
              </li>
            </ul>
            <IoMdArrowDropdown />
          </div>
          <div className="dropdown profile-icon">
            <img
              className="h-10 w-10 profile-container dropdown-toggle img-container"
              src={user?.picture}
              alt=""
            />
            {currLanguage === "IDN" ? (
              <p>
                {user?.name} | {user?.money}
              </p>
            ) : (
              <p>
                {user?.name} | {user?.money * 2}
              </p>
            )}
            <ul className="dropdown-menu">
              <li>
                <Link className="link" to={"/view-profile"}>
                  View Profile
                </Link>
                <Link className="link" to={"/ticket-page"}>
                  View Ticket
                </Link>
                <Link className="link" to={"/history-page"}>
                  View History
                </Link>
                <Link className="link" to={"/game-page"}>
                  Game
                </Link>
                <Link className="link" to={"/ai-page"}>
                  HI AI
                </Link>
                <a className="link" onClick={logout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            {theme === "dark" ? (
              <div className="flex justify-center items-center">
                <img
                  onClick={changeTheme}
                  src={moon_logo}
                  alt="moon_logo"
                  className="h-10 w-10"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <img
                  onClick={changeTheme}
                  src={sun_logo}
                  alt="sun_logo"
                  className="h-10 w-10"
                />
              </div>
            )}
          </div>
        </div>
      </nav>
      {user?.role !== "Admin" ? (
        <div className="navbar-2">
          <Link
            to={"/flight-page"}
            className="link-color link-searchbar-text link-text-container"
          >
            Flights
          </Link>
          <Link
            to={"/hotel-page"}
            className="link-color  link-searchbar-text link-text-container"
          >
            Hotels
          </Link>
        </div>
      ) : (
        <div className="navbar-2">
          <Link
            to={"/flight-page"}
            className="link-color link-searchbar-text link-text-container"
          >
            Flights
          </Link>
          <Link
            to={"/hotel-page"}
            className="link-color  link-searchbar-text link-text-container"
          >
            Hotels
          </Link>
          <Link
            to={"/admin/add-hotel-page"}
            className="link-color  link-searchbar-text link-text-container"
          >
            Add Hotels
          </Link>
          <Link
            to={"/admin/add-flight-page"}
            className="link-color link-searchbar-text link-text-container"
          >
            Add Flights
          </Link>
          <Link
            to={"/admin/add-room-page"}
            className="link-color link-searchbar-text link-text-container"
          >
            Add Rooms
          </Link>
          <Link
            to={"/admin/add-promo-page"}
            className="link-color  link-searchbar-text link-text-container"
          >
            Add Promos
          </Link>
          <Link
            to={"/admin/send-newletter-page"}
            className="link-color  link-searchbar-text link-text-container"
          >
            Send Newletters
          </Link>
          <div className="dropdown m-68px">
            <p className="color-primary p-text-container">Others</p>
            <ul className="dropdown-menu">
              <li>
                <Link to={"/admin/manage-flight-page"} className="link">
                  Manage Flights
                </Link>
                <Link to={"/admin/manage-hotel-page"} className="link">
                  Manage Hotels
                </Link>
                <Link to={"/admin/manage-room-page"} className="link">
                  Manage Rooms
                </Link>
                <Link to={"/admin/manage-promo-page"} className="link">
                  Manage Promos
                </Link>
                <Link to={"/admin/manage-user-page"} className="link">
                  Manage Users
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
