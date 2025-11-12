// src/context/AuthContext.tsx
import {
  createContext,
  useEffect,
  useState,
  type ReactElement,
  useCallback,
} from "react";

export type UserType = {
  id?: number | string;
  name: string;
  email: string;
  role?: "joiner" | "hoster",
  hostId?: "hardeymorla";
};

export type useAuthContextType = {
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  logout: () => void;
};

const initContextState: useAuthContextType = {
  currentUser: null,
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<useAuthContextType>(initContextState);

type ChildrenType = {
  children?: ReactElement | ReactElement[];
};

// Auto-logout after this many milliseconds of inactivity (example: 30 minutes)
const AUTO_LOGOUT_MS = 30 * 60 * 1000;

export const AuthProvider = ({ children }: ChildrenType): ReactElement => {
  // Load persisted user (if any)
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Persist currentUser (or clear) in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // logout function available to consumers
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  }, []);

  // Inactivity timer logic: attach listeners only when a user is logged in
  useEffect(() => {
    if (!currentUser) return; // nothing to do if no user

    // browser setTimeout returns number (not NodeJS.Timeout)
    let logoutTimerId: number;

    const startTimer = () => {
      // clear previous if any
      if (logoutTimerId) window.clearTimeout(logoutTimerId);
      logoutTimerId = window.setTimeout(() => {
        logout();
        // notify user
        alert("You have been logged out due to inactivity.");
      }, AUTO_LOGOUT_MS);
    };

    const resetTimer = () => {
      startTimer();
    };

    // events to treat as activity (you can add more)
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // attach listeners
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));

    // start initial timer
    startTimer();

    // cleanup on unmount or when currentUser changes
    return () => {
      if (logoutTimerId) window.clearTimeout(logoutTimerId);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [currentUser, logout]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
