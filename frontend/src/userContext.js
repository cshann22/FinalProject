import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const setUserData = (id) => {
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
