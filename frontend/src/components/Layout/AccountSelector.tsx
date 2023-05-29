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
      .sort((a, b) => a.id - b.id)
      .map((acc) =>
        acc.subaccounts
          .sort((a, b) => a.id - b.id)
          .map((subacc) => ({
            value: `${subacc.id}`,
            label: `Счет #${subacc.id}`,
            group: `Аккаунт #${acc.id}`,
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
      placeholder={data?.length ? "Выберете аккаунт" : "Нет аккаунтов"}
      data={accounts}
      value={subaccount}
      onChange={handleChange}
      sx={{ width: 150 }}
    />
  );
};

export default AccountSelector;
