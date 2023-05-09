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
      title="Create new account"
      size="auto"
    >
      <Stepper active={active} breakpoint="sm">
        <Stepper.Step label="First step" description="Create account">
          <FirstStep onSuccess={onFirstStepSuccess} />
        </Stepper.Step>

        <Stepper.Step label="Second step" description="Choose subaccounts">
          {account && (
            <SecondStep account={account} onSuccess={onSecondStepSuccess} />
          )}
        </Stepper.Step>
        <Stepper.Step label="Third step" description="You're all done!">
          <Center>
            <Stack my={50}>
              <Group>
                <IconCircleCheck color="teal" size={50} />
                <Title>Success!</Title>
              </Group>
              <Text>You're all set up!</Text>
              <Button onClick={handleFinish}>Continue</Button>
            </Stack>
          </Center>
        </Stepper.Step>
      </Stepper>
    </Modal>
  ) : null;
};

export default AccountForm;
