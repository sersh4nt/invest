import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && !accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      (err) => {
        logout();
        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
