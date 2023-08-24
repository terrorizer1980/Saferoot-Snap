import { createContext, useContext, useState } from "react";
import { makeAPICall } from "./API/helpers";
import { APICalls } from "./API/types";
// Create a new context object
export const AuthContext = createContext(null);

// Define a provider component to provide the authentication status
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  // Define a function to update the authentication status
  const onAuthenticated = () => {
    setAuthenticated(true);
  };


  const signOutHandler = async () => {
    await makeAPICall(APICalls.SIGN_OUT)
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, onAuthenticated, setAuthenticated, signOutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define a hook to access the authentication status
export const useAuth = () => useContext(AuthContext);
