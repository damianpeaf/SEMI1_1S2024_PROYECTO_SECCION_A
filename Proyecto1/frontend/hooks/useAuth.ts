import { create } from "zustand";

type Auth = {
  token: string;
};

type AuthState = {
  auth: Auth | null;
  status: "loading" | "authenticated" | "unauthenticated";
  _userInfoChanged: boolean;
  login: (token: string) => void;
  logout: () => void;
  userInfoChanged: () => void;
  getSession: () => void;
};

export const useAuth = create<AuthState>((set, get) => ({
  auth: null,
  status: "loading",
  _userInfoChanged: false,
  userInfoChanged: () => {
    set(() => ({ _userInfoChanged: !get()._userInfoChanged }));
  },
  login: (token: string) => {
    set(() => ({ auth: { token }, status: "authenticated" }));
    localStorage.setItem("auth", JSON.stringify({ token }));
  },
  getSession: () => {
    set(() => ({ status: "loading", auth: null }));
    const session = localStorage.getItem("auth");
    if (session) {
      const sessionObj = JSON.parse(session);
      if (!sessionObj) return;
      const { token, user } = sessionObj;
      if (!token || !user) return;
      set(() => ({ auth: { token, user }, status: "authenticated" }));
    } else {
      set(() => ({ status: "unauthenticated", auth: null }));
    }
  },
  logout: () => {
    set(() => ({ auth: null, status: "unauthenticated" }));
    localStorage.removeItem("auth");
  },
}));
