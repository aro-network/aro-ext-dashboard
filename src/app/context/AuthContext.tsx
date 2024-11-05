import backendApi from "@/lib/api";
import { User } from "@/lib/type";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user?: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  login: (credentials: { email: string; password: string }) => Promise<void>;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  login: async () => {},
  setUser: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}
const extensionId = "nmngoapofjlbpiipafefnfecmpbnalbc";
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    let e: NodeJS.Timeout;
    if (user) {
      e = setInterval(() => {
        try {
          // @ts-expect-error - chrome is not defined
          chrome.runtime.sendMessage(
            extensionId,
            {
              type: "getUser",
            },
            (response: unknown) => {
              if (!response) {
                logout();
              }
            }
          );
        } catch (error) {
          console.warn(`Extension ${extensionId} not installed`, error);
        }
      }, 1000);
    }

    return () => clearInterval(e);
  }, [user]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const user = await backendApi.loginApi(credentials);
      const accessToken = user.accessToken || "";
      setUser(user);
      localStorage.setItem("token", accessToken); // Storing the token
      // @ts-expect-error - chrome is not defined
      chrome.runtime.sendMessage(extensionId, { type: "setAccessToken", payload: accessToken }, (response: never) => {
        console.log("Response from extension:", response);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    // @ts-expect-error - chrome is not defined
    chrome.runtime.sendMessage(extensionId, { type: "clearAccessToken" }, (response: never) => {
      console.log("Response from extension:", response);
    });
  };

  return <AuthContext.Provider value={{ user, login, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
