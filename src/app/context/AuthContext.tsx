import backendApi from "@/lib/api";
import { getInjectEnReachAI } from "@/lib/ext";
import { Opt } from "@/lib/type";
import { LoginResult, User } from "@/types/user";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AuthContextProps {
  user?: Opt<LoginResult>;
  setUser: (u?: Opt<LoginResult>) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  queryUserInfo?: UseQueryResult<User | undefined>;
}

export const AuthContext = createContext<AuthContextProps>({
  login: async () => { },
  setUser: () => { },
  logout: () => { },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const storageKey = "last-login-user";
export const getLastLoginUser = () => {
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
  const refIsLogout = useRef(false);
  const r = useRouter();
  const [user, setUser] = useState<Opt<LoginResult>>(getLastLoginUser());
  const params = useSearchParams()
  const redirect = params.get("redirect");
  console.info('redirect:', redirect)
  const wrapSetUser = (u?: Opt<LoginResult>) => {
    if (!u) {
      refIsLogout.current = true;
      setUser(null);
      localStorage.removeItem(storageKey);
      getInjectEnReachAI()?.request({ name: "clearAccessToken" }).catch(console.error);
      r.push("/signin");
    } else {
      refIsLogout.current = false;
      setUser(u);
      localStorage.setItem(storageKey, JSON.stringify(u));
      if (u.token) {
        getInjectEnReachAI()?.request({ name: "setAccessToken", body: u.token }).catch(console.error);
      }
      r.push(redirect ? redirect : "/");
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
            if (!stat.logined) {
              console.info("sync logout from ext");
              logout();
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
