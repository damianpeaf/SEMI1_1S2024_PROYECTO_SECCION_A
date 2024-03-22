import { FullUser } from "@/types";
import { create } from "zustand";

type Auth = {
  token: string;
  user: FullUser;
};

type AuthState = {
  auth: Auth | null;
  status: "loading" | "authenticated" | "unauthenticated";
  _userInfoChanged: boolean;
  login: (token: string, user: FullUser) => void;
  logout: () => void;
  userInfoChanged: () => void;
  getSession: () => void;
  getUser: () => FullUser | undefined | null;
};

export const useAuth = create<AuthState>((set, get) => ({
  auth: null,
  status: "loading",
  _userInfoChanged: false,
  userInfoChanged: () => {
    set(() => ({ _userInfoChanged: !get()._userInfoChanged }));
  },
  login: (token: string, user: FullUser) => {
    set(() => ({ auth: { token, user }, status: "authenticated" }));
    localStorage.setItem("auth", JSON.stringify({ token, user }));
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
  getUser: () => {
    if (!get().auth) {
      return null;
    }

    if (!get().auth?.user) {
      return null;
    }

    return get().auth?.user;
  },

  logout: () => {
    set(() => ({ auth: null, status: "unauthenticated" }));
    localStorage.removeItem("auth");
  },
}));
