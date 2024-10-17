import axios from "axios";

const Api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        "Content-Type": "application/json",
    },
});

const backendApi = {
    loginApi: async (data: { email: string, password: string }) => {
        const response = await Api.post("/user/login", data);
        return response.data;
    }
}

export default backendApi;
