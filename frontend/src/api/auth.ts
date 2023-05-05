import { axiosInstance } from "./axios";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

export const login = async (username: string, password: string) => {
  try {
    const r = await axiosInstance.post<LoginResponse>(
      "/api/v1/auth/login",
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

export const register = async (email: string, password: string) => {
  try {
    const r = await axiosInstance.post<UserResponse>("/api/v1/auth/register", {
      email,
      password,
    });
    return r.data;
  } catch (err) {
    console.warn(err);
    throw err;
  }
};
