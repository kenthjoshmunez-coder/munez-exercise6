import React, { createContext, useContext, useState } from "react";

export type Theme = "light" | "dark";

export interface ThemeColors {
  background: string;
  text: string;
  border: string;
  button: string;
  buttonText: string;
  input: string;
  inputText: string;
  placeholder: string;
  correct: string;
  incorrect: string;
  title: string;
}

export const lightTheme: ThemeColors = {
  background: "#F4F7FB",
  text: "#1A237E",
  border: "#BBDEFB",
  button: "#1976D2",
  buttonText: "#FFFFFF",
  input: "#FFFFFF",
  inputText: "#1A237E",
  placeholder: "#90CAF9",
  correct: "#A5D6A7",
  incorrect: "#EF9A9A",
  title: "#0D47A1",
};

export const darkTheme: ThemeColors = {
  background: "#121212",
  text: "#E0E0E0",
  border: "#424242",
  button: "#1976D2",
  buttonText: "#FFFFFF",
  input: "#1E1E1E",
  inputText: "#E0E0E0",
  placeholder: "#616161",
  correct: "#66BB6A",
  incorrect: "#EF5350",
  title: "#64B5F6",
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const colors = theme === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
