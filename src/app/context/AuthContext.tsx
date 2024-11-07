import backendApi from "@/lib/api";
import { getInjectEnReachAI } from "@/lib/broswer";
import { Opt, User } from "@/lib/type";
import { useRouter } from "next/navigation";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user?: Opt<User>;
  setUser: (u?: Opt<User>) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  login: async () => {},
  setUser: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const storageKey = "last-login-user";
const getLastLoginUser = () => {
  try {
    const json = localStorage.getItem(storageKey);
    if (!json) return null;
    const u = JSON.parse(json) as User
    return u;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Opt<User>>(getLastLoginUser());
  const wrapSetUser = (u?: Opt<User>) => {
    if (!u) {
      setUser(null);
      localStorage.removeItem(storageKey);
      getInjectEnReachAI()?.request({ name: "clearAccessToken" });
    } else {
      setUser(u);
      localStorage.setItem(storageKey, JSON.stringify(u));
      u.accessToken && getInjectEnReachAI()?.request({ name: "setAccessToken", body: u.accessToken });
    }
  };
  const r = useRouter();
  useEffect(() => {
    let e: NodeJS.Timeout;
    if (user && user.accessToken) {
      e = setInterval(() => {
        const injectedEnReachAI = getInjectEnReachAI();
        if (!injectedEnReachAI) {
          console.warn(`Extension not installed`);
          return;
        }
        injectedEnReachAI
          .request({
            name: "getUser",
          })
          .then((response: unknown) => {
            if (!response) {
              logout();
            }
          });
      }, 1000);
    }
    return () => clearInterval(e);
  }, [user]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      if (!credentials.email || !credentials.password) return;
      const user = await backendApi.loginApi(credentials);
      wrapSetUser(user);
      r.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    wrapSetUser();
  };

  return <AuthContext.Provider value={{ user, login, logout, setUser: wrapSetUser }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
