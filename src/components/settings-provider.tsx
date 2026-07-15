import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type FontSize = "sm" | "md" | "lg";

interface SettingsContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  fontSize: FontSize;
  setFontSize: (f: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const FONT_MAP: Record<FontSize, string> = { sm: "14px", md: "16px", lg: "18px" };

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [fontSize, setFontSizeState] = useState<FontSize>("md");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = (localStorage.getItem("app-theme") as Theme | null) ?? "light";
    const f = (localStorage.getItem("app-fontsize") as FontSize | null) ?? "md";
    setThemeState(t);
    setFontSizeState(f);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.setProperty("--app-font-size", FONT_MAP[fontSize]);
    localStorage.setItem("app-theme", theme);
    localStorage.setItem("app-fontsize", fontSize);
  }, [theme, fontSize, hydrated]);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
        fontSize,
        setFontSize: setFontSizeState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}