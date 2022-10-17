import React
// , { useEffect, useState } 
from "react";
import AppBody from "../AppBody";
import Header from "../Header";
import { useQueryUsers } from "../../hooks/useQueryUsers";
import UsersContext from "../../provider/UsersContextProvider";

export interface HeaderProps {}

const AppRoot: React.FC<HeaderProps> = () => {
  const { data: users } = useQueryUsers();
  return (
    <>
      <UsersContext.Provider value={users}>
        <Header />
        <AppBody />
      </UsersContext.Provider>
    </>
  );
};

export default AppRoot;
