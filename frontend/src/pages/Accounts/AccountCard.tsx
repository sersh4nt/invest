import { Card, Text } from "@mantine/core";
import { AccountScheme } from "../../models";
import SubaccountSection from "./SubaccountSection";

interface AccountCardProps {
  account: AccountScheme;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Text>Account №{account.id}</Text>
      </Card.Section>
      {account.subaccounts.map((subaccount, key) => (
        <SubaccountSection subaccount={subaccount} key={key} />
      ))}
    </Card>
  );
};

export default AccountCard;
