import { createModel } from "@/base/hooks/model"
import { useEffect, useState } from "react";
import * as monaco from "monaco-editor";

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('theme-mode', 'dark');
    } else {
      document.body.removeAttribute('theme-mode');
    }
    monaco.editor.setTheme(isDarkMode ? "dark-plus" : "light-plus");
  }, [isDarkMode]);

  return {
    isDarkMode,
    setIsDarkMode,
  }
}

export const ThemeModel = createModel(useTheme);
