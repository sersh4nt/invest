import {
  Modal,
  Stepper,
  Title,
  Text,
  Center,
  Button,
  Stack,
  Group,
} from "@mantine/core";
import { useState } from "react";
import { AccountScheme } from "../../../models";
import { IconCircleCheck } from "@tabler/icons-react";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import { useQueryClient } from "react-query";
import { getGetAccountsListApiV1AccountsGetQueryKey } from "../../../api/accounts/accounts";

interface AccountFormProps {
  visible: boolean;
  onClose: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ visible, onClose }) => {
  const [active, setActive] = useState<number>(0);
  const [account, setAccount] = useState<AccountScheme | null>(null);
  const client = useQueryClient();

  const onFirstStepSuccess = (account: AccountScheme) => {
    setActive(1);
    setAccount(account);
  };

  const onSecondStepSuccess = () => {
    setActive(2);
  };

  const handleFinish = () => {
    setAccount(null);
    client.invalidateQueries(getGetAccountsListApiV1AccountsGetQueryKey());
    onClose();
  };

  return visible ? (
    <Modal
      opened={visible}
      onClose={onClose}
      title="Создать новый аккаунт"
      size="auto"
    >
      <Stepper active={active} breakpoint="sm">
        <Stepper.Step label="Шаг №1" description="Введите токен">
          <FirstStep onSuccess={onFirstStepSuccess} />
        </Stepper.Step>

        <Stepper.Step label="Шаг №2" description="Выберете счета">
          {account && (
            <SecondStep account={account} onSuccess={onSecondStepSuccess} />
          )}
        </Stepper.Step>
        <Stepper.Step label="Шаг №3" description="Готово!">
          <Center>
            <Stack my={50}>
              <Group>
                <IconCircleCheck color="teal" size={50} />
                <Title>Успешно!</Title>
              </Group>
              <Text>Ваш аккаунт добавлен в систему!</Text>
              <Button onClick={handleFinish}>Продолжить</Button>
            </Stack>
          </Center>
        </Stepper.Step>
      </Stepper>
    </Modal>
  ) : null;
};

export default AccountForm;
