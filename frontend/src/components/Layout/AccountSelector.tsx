import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import useSubaccount from "../../hooks/useSubaccount";

const AccountSelector: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const { subaccount, setSubaccount } = useSubaccount();
  const { data } = useGetAccountsListApiV1AccountsGet();

  useEffect(() => {
    if (!data) {
      return;
    }
    setAccounts(
      data
        .map((acc) =>
          acc.subaccounts.map((subacc) => ({
            value: `${subacc.id}`,
            label: `Subaccount #${subacc.id}`,
            group: `Account #${acc.id}`,
          }))
        )
        .flat(1)
    );
  }, [data]);

  return (
    <Select
      placeholder="Select account"
      data={accounts}
      value={subaccount}
      onChange={setSubaccount}
    />
  );
};

export default AccountSelector;
