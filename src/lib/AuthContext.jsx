import React, { createContext, useState, useContext } from "react";

// Standalone AuthContext — no Base44 server required.
// The app is fully public; auth state is always ready.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useState(null);

  const value = {
    user,
    isAuthenticated: false,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    navigateToLogin: () => {},
    logout: () => {},
    checkAppState: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
