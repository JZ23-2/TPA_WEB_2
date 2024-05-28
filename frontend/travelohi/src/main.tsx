import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "./context/UserContext.tsx";
import ThemeProvider from "./context/ThemeContext.tsx";
import "./global.scss";
import SearchProvider from "./context/SearchContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserAuthProvider>
    <ThemeProvider>
      <SearchProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SearchProvider>
    </ThemeProvider>
  </UserAuthProvider>
);
