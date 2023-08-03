import { createContext, useContext, useState } from "react";
// Create a new context object
export const AuthContext = createContext(null);

// Define a provider component to provide the authentication status
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  // Define a function to update the authentication status
  const onAuthenticated = () => {
    setAuthenticated(true);
  };


  const signOutHandler = () => {
    try {
      fetch(`http://localhost:5433/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      setAuthenticated(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, onAuthenticated, setAuthenticated, signOutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define a hook to access the authentication status
export const useAuth = () => useContext(AuthContext);
