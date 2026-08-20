import { createContext, useCallback, useContext, useEffect, useState } from "react";

const PreferencesContext = createContext(null);

const REDUCED_MOTION_KEY = "nexus_reduced_motion";

/**
 * Purely local, frontend-only preferences (nothing here is sent to or
 * read from the backend). Currently just "reduced motion" — an explicit
 * override on top of the OS-level prefers-reduced-motion query that
 * Framer Motion's MotionConfig already respects by default.
 */
export function PreferencesProvider({ children }) {
  const [reducedMotion, setReducedMotionState] = useState(
    () => localStorage.getItem(REDUCED_MOTION_KEY) === "1"
  );

  useEffect(() => {
    localStorage.setItem(REDUCED_MOTION_KEY, reducedMotion ? "1" : "0");
  }, [reducedMotion]);

  const setReducedMotion = useCallback((value) => {
    setReducedMotionState(value);
  }, []);

  return (
    <PreferencesContext.Provider value={{ reducedMotion, setReducedMotion }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
