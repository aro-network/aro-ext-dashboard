import axios from "axios";
import { User } from "./type";

const Api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export type RES<T> = {
  data: T;
};

const backendApi = {
  loginApi: async (data: { email: string; password: string }) => {
    const response = await Api.post<RES<User>>("/user/login", data);
    return response.data.data;
  },
  registerApi: async (data: { email: string; password: string }) => {
    const response = await Api.post<RES<User>>("/user/register", { ...data, confirmPassword: data.password });
    return response.data.data;
  },

  getUser: async (accessToken: string) => {
    Api.get<RES<User>>("/user/info", { headers: { Authorization: 'B'}})
  }
};

export default backendApi;
