import { useContext } from "react";
import AuthContext, { IAuthContextType } from "../context/AuthContext";

const useAuth = () => useContext(AuthContext) as IAuthContextType;

export default useAuth;
