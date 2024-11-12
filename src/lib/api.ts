import { NodeItem } from "@/types/node";
import { LoginResult, SingUpResult, User, UserReward } from "@/types/user";
import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export type RES<T> = {
  data: T;
};

const backendApi = {
  setAuth: (auth?: string) => {
    if (auth) {
      Api.defaults.headers.common["Authorization"] = auth.startsWith("Bearer") ? auth : `Bearer ${auth}`;
    } else {
      delete Api.defaults.headers.common["Authorization"];
    }
  },
  loginApi: async (data: { email: string; password: string }) => {
    const response = await Api.post<RES<LoginResult>>("/user/login", data);
    return response.data.data;
  },
  registerApi: async (data: { email: string; password: string; invateCode: string }) => {
    const response = await Api.post<RES<SingUpResult>>("/user/signUp", { ...data, confirmPassword: data.password });
    return response.data.data;
  },
  userInfo: async () => {
    const response = await Api.get<RES<User>>("/user/info");
    return response.data.data;
  },
  sendResetPassword: async () => {
    await Api.post<RES<undefined>>("/user/password/recover");
    return true;
  },
  resetPassword: async (password: string) => {
    await Api.post<RES<undefined>>("/user/password/reset", { password });
    return true;
  },
  userUpdate: async (data: { username?: string; disconnect?: { x?: boolean; tg?: boolean; discord?: boolean } }) => {
    await Api.post<RES<undefined>>("/user/profile/update", data);
    return true;
  },

  userReward: async () => {
    const response = await Api.get<RES<UserReward>>("/user/reward");
    return response.data.data;
  },

  nodeList: async () => {
    const response = await Api.get<RES<NodeItem[]>>("/node/list");
    return response.data.data;
  },

  getIP: async () => {
    const ip = await axios.get<{
      ipString: string;
      ipType: string;
    }>("https://api.bigdatacloud.net/data/client-ip");
    return ip.data;
  },
};

export default backendApi;
