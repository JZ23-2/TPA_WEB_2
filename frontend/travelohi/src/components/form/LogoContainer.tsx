import white_remove from "../../assets/white_remove.png";
import black_remove from "../../assets/dark-remove.png";
import moon_logo from "../../assets/moon.png";
import sun_logo from "../../assets/sun.png";
import { useTheme } from "../../context/ThemeContext";

function LogoContainer() {
  const { getTheme, changeTheme } = useTheme();
  const currTheme = getTheme();
  return (
    <div className="flex items-center justify-center mt-2">
      {currTheme === "dark" ? (
        <div className="flex justify-center items-center">
          <img className="w-30 h-20" src={black_remove} alt="white_logo" />
          <img
            onClick={changeTheme}
            className="h-10 w-10 mt-2"
            src={moon_logo}
            alt="moon_logo"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <img className="w-30 h-20" src={white_remove} alt="blue_logo" />
          <img
            onClick={changeTheme}
            className="w-10 h-10 mt-2"
            src={sun_logo}
            alt="sun_logo"
          />
        </div>
      )}
    </div>
  );
}

export default LogoContainer;
