import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";

interface IThemeInterface {
  theme: string;
  changeTheme: () => void;
  getTheme: () => string;
}

const ThemeContext = createContext<IThemeInterface>({} as IThemeInterface);

function ThemeProvider({ children }: IChildren) {
  const [theme, setTheme] = useState("dark");

  const getTheme = () => {
    const currTheme = localStorage.getItem("theme") || "defaulTheme";
    return currTheme;
  };

  const changeTheme = () => {
    setTheme((prev) => {
      return prev === "dark" ? "light" : "dark";
    });
    localStorage.setItem("theme", theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, getTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeProvider;
