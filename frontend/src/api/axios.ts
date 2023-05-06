import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";
import Qs from "qs";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: "repeat" }),
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth;
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (value) => value,
  (error) => {
    if (error?.response?.status == 403) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  //@ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled!");
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
