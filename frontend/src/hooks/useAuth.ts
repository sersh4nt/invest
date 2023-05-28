import { useDispatch, useSelector } from "react-redux";
import {
  LoginFormInput,
  RegisterFormInput,
  authSelector,
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  setError as setErrorAction,
} from "../store/authSlice";
import { AppDispatch } from "../store";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(authSelector);

  const login = (data: LoginFormInput) => dispatch(loginAction(data));
  const register = (data: RegisterFormInput) => dispatch(registerAction(data));
  const setError = (error: string) => dispatch(setErrorAction(error));
  const logout = () => dispatch(logoutAction());

  return { login, register, logout, setError, ...auth };
};

export default useAuth;
