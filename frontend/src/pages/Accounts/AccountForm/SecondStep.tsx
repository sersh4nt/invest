import {
  Button,
  Center,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { useEditSubaccountApiV1SubaccountsSubaccountIdPut } from "../../../api/accounts/accounts";
import { AccountScheme } from "../../../models";

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
      setError("При отправлении запроса возникла ошибка...");
    }
  };

  return (
    <Stack>
      <Title order={4}>Аккаунт №{account.id}</Title>
      {account.name && <Text>Название: {account.name}</Text>}
      {account.description && <Text>Описание: {account.description}</Text>}
      {account.subaccounts.map((item, key) => (
        <React.Fragment key={key}>
          <Divider my="sx" />
          <Title order={4}>Счет №{item.broker_id}</Title>
          {item.name && <Text>Название: {item.name}</Text>}
          <Group position="apart">
            <Text>Вести аналитику</Text>
            <Switch
              checked={enabled[key]}
              onChange={(e) => handleEnable(e, key)}
            />
          </Group>
        </React.Fragment>
      ))}
      <Center>
        <Button onClick={handleSave} loading={isLoading}>
          Сохранить изменения
        </Button>
      </Center>
      {error && <Text color="red">{error}</Text>}
    </Stack>
  );
};

export default SecondStep;
