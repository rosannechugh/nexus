import { createContext, useCallback, useEffect, useRef, useState } from "react";
import api, { TOKEN_STORAGE_KEY, UNAUTHORIZED_EVENT } from "@/services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );
  // True until we've resolved whether a stored token (if any) is valid.
  const [isLoading, setIsLoading] = useState(true);
  // Tracks the token value already confirmed against the backend (either
  // by this effect or by login() itself), so setting accessToken after a
  // successful login doesn't trigger a second, redundant /api/auth/me
  // call for a token we already know is good.
  const resolvedTokenRef = useRef(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    resolvedTokenRef.current = null;
    setAccessToken(null);
    setUser(null);
  }, []);

  // On startup (and whenever the token changes from an external source,
  // e.g. a page refresh restoring it from localStorage) verify it
  // against the backend rather than trusting whatever's in storage.
  useEffect(() => {
    let cancelled = false;

    async function resolveSession() {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      if (resolvedTokenRef.current === accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/api/auth/me");
        if (!cancelled) {
          setUser(data);
          resolvedTokenRef.current = accessToken;
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    setIsLoading(true);
    resolveSession();

    return () => {
      cancelled = true;
    };
  }, [accessToken, clearSession]);

  // The Axios interceptor in services/api.js fires this on any 401 so
  // session state clears no matter which component made the request.
  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    // Backend expects OAuth2 password-flow form data, not JSON.
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const { data } = await api.post("/api/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);

    // If the login response already includes the user, use it and skip
    // the extra round trip; otherwise fetch /api/auth/me explicitly.
    // Either way, mark this token as resolved before triggering the
    // accessToken-change effect so it doesn't re-fetch /me a second time.
    if (data.user) {
      setUser(data.user);
    } else {
      const { data: me } = await api.get("/api/auth/me");
      setUser(me);
    }
    resolvedTokenRef.current = data.access_token;
    setAccessToken(data.access_token);

    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    // Registration does not authenticate the user — the backend returns
    // the created account only, no token. Callers should route to /login.
    const { data } = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken) && Boolean(user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
