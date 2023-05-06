import { useSelector, useDispatch } from "react-redux";
import {
  activeSubaccountSelector,
  setActiveSubaccount,
} from "../store/subaccountSlice";
import { AppDispatch } from "../store";

const useSubaccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const setSubaccount = (s: string) => dispatch(setActiveSubaccount(s));

  const subaccount = useSelector(activeSubaccountSelector);

  return { subaccount, setSubaccount };
};

export default useSubaccount;
