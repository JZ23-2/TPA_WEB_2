import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";
import { IUser } from "../interfaces/user-interface";

interface IUserContext {
  user: IUser | null;
  update: (user: IUser | null) => void;
  getUser: () => IUser | null;
}

const context = createContext<IUserContext>({} as IUserContext);
const STORAGE_KEY = "JACKSONNGANTUK123";

export function UserAuthProvider({ children }: IChildren) {
  const [user, setUser] = useState<IUser | null>(null);

  function getLocalStorage() {
    const temp = localStorage.getItem(STORAGE_KEY) || "";
    if (temp === "") return false;
    const userStorage = JSON.parse(temp);
    if (userStorage === undefined || userStorage === null) {
      return false;
    } else {
      return userStorage;
    }
  }

  function setLocalStorage(user: IUser | null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  function update(user: IUser | null) {
    setUser(user);
    setLocalStorage(user);
  }

  function getUser(): IUser | null {
    const userStorage = getLocalStorage();
    if (!userStorage || Object.keys(userStorage).length === 0) {
      setUser(null);
      return null;
    }
    setUser(userStorage as IUser);
    return userStorage as IUser;
  }

  const value = { update, user, getUser };
  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useUserAuth() {
  return useContext(context);
}
