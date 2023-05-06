import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { RootState } from ".";
import { axiosInstance } from "../api";
import { BearerResponse, UserRead } from "../models";

interface AuthState {
  isLoading: boolean;
  error: string;
  accessToken: string | null;
  user: UserRead | null;
  persist: boolean;
}

export interface RegisterFormInput {
  email: string;
  password: string;
}

export interface LoginFormInput extends RegisterFormInput {
  persist: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: "",
  accessToken: localStorage.getItem("access"),
  user: null,
  persist: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, persist }: LoginFormInput, thunkAPI) => {
    try {
      const response = await axiosInstance.post<BearerResponse>(
        "/api/v1/auth/login",
        { username: email, password },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (persist) {
        localStorage.setItem("access", response.data.access_token);
      }
      return response.data.access_token;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err?.response?.data?.detail == "LOGIN_BAD_CREDENTIALS") {
          thunkAPI.dispatch(setError("Invalid username or password!"));
        }
      }
      return null;
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: RegisterFormInput, thunkAPI) => {
    thunkAPI.dispatch(setIsLoading(true));
    try {
      await axiosInstance.post<UserRead>("/api/v1/auth/register", {
        email,
        password,
      });
      return true;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err?.response?.data?.detail == "REGISTER_USER_ALREADY_EXISTS") {
          thunkAPI.dispatch(setError("User with this email already exists!"));
        }
      }
      return false;
    } finally {
      thunkAPI.dispatch(setIsLoading(false));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      localStorage.removeItem("access");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.accessToken = action.payload;
      state.isLoading = false;
      state.error = "";
    }),
      builder.addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      }),
      builder.addCase(login.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const accessTokenSelector = (state: RootState) => state.auth.accessToken;
export const authSelector = (state: RootState) => state.auth;

export const { setError, setIsLoading, logout } = authSlice.actions;

export default authSlice;
