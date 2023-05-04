import { AxiosError } from "axios";
import { createContext, useState } from "react";
import { login as apiLogin } from "../api";

const AuthContext = createContext({});

interface IAuthProviderProps {
  children: JSX.Element;
}

export interface IAuthContextType {
  isLoading: boolean;
  error: string;
  accessToken: string;
  user: any;
  login: (username: string, password: string, persist: boolean) => boolean;
  logout: () => void;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access")
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("access");
  };

  const login = async (
    username: string,
    password: string,
    persist: boolean
  ) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(username, password);
      setAccessToken(response.access_token);
      if (persist) {
        localStorage.setItem("access", response.access_token);
      }
      return true;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err?.response?.data?.detail == "LOGIN_BAD_CREDENTIALS") {
          setError("Invalid username or password");
        }
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, accessToken, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
