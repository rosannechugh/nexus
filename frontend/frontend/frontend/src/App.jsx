import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { PreferencesProvider, usePreferences } from "@/context/PreferencesContext";
import { ToastProvider } from "@/context/ToastContext";
import AppRoutes from "@/routes/AppRoutes";

function MotionPreferenceBoundary({ children }) {
  const { reducedMotion } = usePreferences();
  // "user" respects the OS-level prefers-reduced-motion query; the
  // in-app Settings toggle can additionally force it on regardless of
  // the OS setting.
  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <MotionPreferenceBoundary>
          <ToastProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </MotionPreferenceBoundary>
      </PreferencesProvider>
    </BrowserRouter>
  );
}
