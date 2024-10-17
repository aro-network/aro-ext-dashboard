import React, {createContext, useContext, useEffect, useState} from "react";
import backendApi from "@/app/lib/api/backend";

interface AuthContextProps {
    user?: User | null;
    login: (credentials: {email: string, password: string}) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: undefined,
    login: async () => {},
    logout: () => { },
});

interface User {
    role: string;
    email: string;
    userId: string;
}

interface AuthProviderProps {
    children: React.ReactNode;
}
const extensionId = "ihiblmoaodjjlcambgnhjhginnodlcap";
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User|null>();

    useEffect(() => {
        let e: NodeJS.Timeout;
        if (user) {
            e = setInterval(() => {
                try {
                    // @ts-expect-error - chrome is not defined
                    chrome.runtime.sendMessage(extensionId, {
                        type: 'getUser'
                    }, (response: unknown) => {
                        if (!response) {
                            logout();
                        }
                    });
                } catch (error) {
                    console.warn(`Extension ${extensionId} not installed`, error);
                }
            }, 1000);
        }

        return () => clearInterval(e);
    }, [user]);

    const login = async (credentials: {email: string, password: string}) => {
        try {
            const response = await backendApi.loginApi(credentials);
            const {email, role, userId, accessToken} = response.data;
            setUser({
                email,
                role,
                userId,
            });
            localStorage.setItem("token", accessToken);  // Storing the token
            // @ts-expect-error - chrome is not defined
            chrome.runtime.sendMessage(extensionId,
                { type: "setAccessToken", payload: accessToken },
                (response: never) => {
                    console.log("Response from extension:", response);
                })
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        // @ts-expect-error - chrome is not defined
        chrome.runtime.sendMessage(extensionId,
            { type: "clearAccessToken" },
            (response: never) => {
                console.log("Response from extension:", response);
            })
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};
