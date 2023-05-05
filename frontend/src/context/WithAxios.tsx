import { useEffect } from "react";
import { AXIOS_INSTANCE } from "../api";
import useAuth from "../hooks/useAuth";

interface AxiosContextProps {
  children: JSX.Element;
}

export const WithAxios: React.FC<AxiosContextProps> = ({ children }) => {
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    const requestInterceptor = AXIOS_INSTANCE.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = AXIOS_INSTANCE.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status == 403) {
          logout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      AXIOS_INSTANCE.interceptors.request.eject(requestInterceptor);
      AXIOS_INSTANCE.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return children;
};
