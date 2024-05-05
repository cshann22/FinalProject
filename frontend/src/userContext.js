import React, { createContext, useContext, useState } from 'react';

// Create a context for the user data
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component to wrap the app and provide user data to all components
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initial value is null

  // Function to set the user ID
  const setUserData = (id) => {
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
