import backendApi from "@/lib/api";
import { getInjectEnReachAI } from "@/lib/broswer";
import { Opt } from "@/lib/type";
import { LoginResult, User } from "@/types/user";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user?: Opt<LoginResult>;
  setUser: (u?: Opt<LoginResult>) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  queryUserInfo?: UseQueryResult<User | undefined>;
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
    const u = JSON.parse(json) as LoginResult;
    return u;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const r = useRouter();
  const [user, setUser] = useState<Opt<LoginResult>>(getLastLoginUser());
  const wrapSetUser = (u?: Opt<LoginResult>) => {
    if (!u) {
      setUser(null);
      localStorage.removeItem(storageKey);
      getInjectEnReachAI()?.request({ name: "clearAccessToken" }).catch(console.error);
      r.push("/signin");
    } else {
      setUser(u);
      localStorage.setItem(storageKey, JSON.stringify(u));
      if (u.token) {
        getInjectEnReachAI()?.request({ name: "setAccessToken", body: u.token }).catch(console.error);
      }
      r.push("/");
    }
  };

  const logout = () => {
    wrapSetUser();
  };
  useEffect(() => {
    let e: NodeJS.Timeout;
    if (user && user.token) {
      e = setInterval(() => {
        const injectedEnReachAI = getInjectEnReachAI();
        if (!injectedEnReachAI) {
          console.warn(`Extension not installed`);
          return;
        }
        injectedEnReachAI
          .request({
            name: "getStat",
          })
          .then((stat: { logined: boolean; userLogout: boolean }) => {
            if (stat.userLogout) {
              console.info("sync logout from ext");
              logout();
              getInjectEnReachAI()?.request({ name: "clearLogout" }).catch(console.error);
            } else if (!stat.logined) {
              console.info("sync login to ext");
              getInjectEnReachAI()?.request({ name: "setAccessToken", body: user.token }).catch(console.error);
            } else {
              console.info("not need do something");
            }
          })
          .catch(console.error);
      }, 1000);
    }
    return () => clearInterval(e);
  }, [user]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      if (!credentials.email || !credentials.password) return;
      const user = await backendApi.loginApi(credentials);
      wrapSetUser(user);
      backendApi.setAuth();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  backendApi.setAuth(user?.token);
  const queryUserInfo = useQuery({
    queryKey: ["QueryUserInfo", user?.token],
    enabled: Boolean(user?.token),
    queryFn: () => backendApi.userInfo(),
  });
  // const queryUserInfo = useSWR(["QueryUserInfo", user?.token, location.href], () => (user?.token ? backendApi.userInfo() : undefined));
  return <AuthContext.Provider value={{ user, login, logout, setUser: wrapSetUser, queryUserInfo }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
