import {
  Stack,
  Divider,
  Text,
  Title,
  Group,
  Switch,
  Button,
} from "@mantine/core";
import { AccountScheme } from "../../../models";
import React, { useState } from "react";
import { useEditSubaccountApiV1SubaccountsSubaccountIdPut } from "../../../api/accounts/accounts";

interface SecondStepProps {
  account: AccountScheme;
  onSuccess: () => void;
}

const SecondStep: React.FC<SecondStepProps> = ({ account, onSuccess }) => {
  const [error, setError] = useState<string>("");
  const { mutateAsync, isLoading } =
    useEditSubaccountApiV1SubaccountsSubaccountIdPut();

  const [enabled, setEnabled] = useState<boolean[]>(
    account.subaccounts.map((item) => item.is_enabled ?? false)
  );

  const handleEnable = (e: any, key: number) => {
    setError("");
    const newValues = [...enabled];
    newValues[key] = e.currentTarget.checked;
    setEnabled(newValues);
  };

  const handleSave = async () => {
    const tasks = [
      account.subaccounts.map((item, key) =>
        mutateAsync({
          subaccountId: item.id,
          data: { is_enabled: enabled[key] },
        })
      ),
    ];
    try {
      await Promise.all(tasks);
      onSuccess();
    } catch (err) {
      setError("Some error occured during requests...");
    }
  };

  return (
    <Stack>
      <Title order={4}>Account #{account.id}</Title>
      {account.name && <Text>Name: {account.name}</Text>}
      {account.description && <Text>Description: {account.description}</Text>}
      {account.subaccounts.map((item, key) => (
        <React.Fragment key={key}>
          <Divider my="sx" />
          <Title order={4}>Subaccount #{item.broker_id}</Title>
          {item.name && <Text>Name: {item.name}</Text>}
          <Group position="apart">
            <Text>Enabled</Text>
            <Switch
              checked={enabled[key]}
              onChange={(e) => handleEnable(e, key)}
            />
          </Group>
        </React.Fragment>
      ))}
      <Button onClick={handleSave} loading={isLoading}>
        Save changes
      </Button>
      {error && <Text color="red">{error}</Text>}
    </Stack>
  );
};

export default SecondStep;
