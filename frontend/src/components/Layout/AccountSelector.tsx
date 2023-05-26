import { Select, SelectItem } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import useSubaccount from "../../hooks/useSubaccount";

const AccountSelector: React.FC = () => {
  const { subaccount, setSubaccount } = useSubaccount();

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
    if (!data.length) {
      setSubaccount(null);
    }
  }, [data]);

  const handleChange = (s: string) => setSubaccount(s);

  return (
    <Select
      placeholder={data?.length ? "Select account" : "No accounts"}
      data={accounts}
      value={subaccount}
      onChange={handleChange}
    />
  );
};

export default AccountSelector;
