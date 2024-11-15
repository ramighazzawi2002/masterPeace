import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPaswsword, setIsForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  return (
    <UserContext.Provider
      value={{
        email,
        setEmail,
        userName,
        setUserName,
        password,
        setPassword,
        isForgotPaswsword,
        setIsForgotPassword,
        isLoggedIn,
        setIsLoggedIn,
        isGoogle,
        setIsGoogle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
