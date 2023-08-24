import { createContext, FunctionComponent, ReactNode, useState } from "react";
import { ThemeProvider } from "styled-components";
import { getThemePreference } from "./utils";
import { light } from "./config/theme";
import "./rainbowkit/rainbowkit.css";
import { AuthProvider } from "./hooks"; // Import the AuthProvider

export type RootProps = {
  children: ReactNode;
};

type ToggleTheme = () => void;

export const ToggleThemeContext = createContext<ToggleTheme>(
  (): void => undefined
);

export const Root: FunctionComponent<RootProps> = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(getThemePreference());

  const toggleTheme: ToggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <ToggleThemeContext.Provider value={toggleTheme}>
      <ThemeProvider theme={light}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ToggleThemeContext.Provider>
  );
};
