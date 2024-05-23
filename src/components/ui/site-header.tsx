"use client";

import { useEffect, useState } from "react";
import { ThemeSelector } from "./theme-selector";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until the component is mounted to ensure the theme state is available
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme instead of theme for more accurate theme detection
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
          {mounted && (
            <img
              src={currentTheme === "light" ? "/adamik-logo-light.png" : "/adamik-logo-dark.png"}
              alt="Adamik Logo"
              className="h-8"
            />
          )}
          <span className="font-bold">Demo Application</span>
        </div>
        <nav className="flex items-center">
          <ThemeSelector />
        </nav>
      </div>
    </header>
  );
}