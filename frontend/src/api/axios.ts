import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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
