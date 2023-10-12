/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
const IndexContext = createContext();

function IndexProvider({ children }) {
  const [selectedTab, setSelectedTab] = useState("count");
  const value = {
    selectedTab,
    setSelectedTab,
  };

  return (
    <IndexContext.Provider value={value}>{children}</IndexContext.Provider>
  );
}

export { IndexProvider, IndexContext };
