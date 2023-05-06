import { Select, SelectItem } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import {
  activeSubaccountSelector,
  setActiveSubaccount,
} from "../../store/subaccountSlice";

const AccountSelector: React.FC = () => {
  const dispatch = useDispatch();
  const subaccount = useSelector(activeSubaccountSelector);

  const [accounts, setAccounts] = useState<SelectItem[]>([]);
  const { data } = useGetAccountsListApiV1AccountsGet();

  useEffect(() => {
    if (!data) {
      return;
    }
    const newAccounts = data
      .map((acc) =>
        acc.subaccounts.map((subacc) => ({
          value: `${subacc.id}`,
          label: `Subaccount #${subacc.id}`,
          group: `Account #${acc.id}`,
        }))
      )
      .flat(1);

    setAccounts(newAccounts);
  }, [data]);

  const handleChange = (s: string) => dispatch(setActiveSubaccount(s));

  return (
    <Select
      placeholder="Select account"
      data={accounts}
      value={subaccount}
      onChange={handleChange}
    />
  );
};

export default AccountSelector;
