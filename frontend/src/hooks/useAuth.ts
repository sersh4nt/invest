import { useDispatch, useSelector } from "react-redux";
import {
  LoginFormInput,
  RegisterFormInput,
  authSelector,
  login as loginAction,
  register as registerAction,
} from "../store/authSlice";
import { AppDispatch } from "../store";

const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(authSelector);

  const login = (data: LoginFormInput) => dispatch(loginAction(data));
  const register = (data: RegisterFormInput) => dispatch(registerAction(data));

  return { login, register, ...auth };
};

export default useAuth;
