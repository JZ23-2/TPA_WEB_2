import { createContext, useContext } from "react";
import { IChildren } from "../interfaces/children-interface";

interface IResultInterface {
  flightSearch: [];
  hotelSearch: [];
}

interface ISearchInterface {
  addResult: (flightSearch: [], hotelSearch: []) => void;
  getResult: () => IResultInterface;
}

const SearchContext = createContext<ISearchInterface>({} as ISearchInterface);

function SearchProvider({ children }: IChildren) {
  var result: IResultInterface = {
    flightSearch: [],
    hotelSearch: [],
  };

  const addResult = (flightSearch: [], hotelSearch: []) => {
    result.flightSearch = flightSearch;
    result.hotelSearch = hotelSearch;
  };

  const getResult = () => {
    return result;
  };

  return (
    <SearchContext.Provider value={{ addResult, getResult }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}

export default SearchProvider;
