import axiosInstance from "./axios";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = async (username: string, password: string) => {
  try {
    const r = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      { username, password },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return r.data;
  } catch (err) {
    console.warn(err);
    throw err;
  }
};
