"use client";

import { useState, useEffect } from 'react';

import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    if (newIsDarkMode) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md hover:bg-card transition-colors"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <Moon size={20} className="p-2 box-content text-foreground/70 hover:rotate-[35deg] transition-transform duration-200" />
      ) : (
        <Sun size={20} className="p-2 box-content text-yellow-500 hover:rotate-[45deg] transition-transform duration-200" />
      )}
    </button>
  );
};