import {
  SimpleGrid,
  Skeleton,
  Button,
  Container,
  Center,
  Paper,
} from "@mantine/core";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import { IconPlus } from "@tabler/icons-react";
import AccountCard from "./AccountCard";
import { useState } from "react";
import AccountForm from "./AccountForm";

const Accounts: React.FC = () => {
  const { data, isLoading } = useGetAccountsListApiV1AccountsGet();

  const [visible, setVisible] = useState<boolean>(false);

  const handleAddAccount = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <>
      <Skeleton visible={isLoading}>
        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: "xl", cols: 3 },
            { maxWidth: "md", cols: 2, spacing: "md" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
        >
          {data?.map((acc, key) => (
            <AccountCard account={acc} key={key} />
          ))}
        </SimpleGrid>
      </Skeleton>
      <Container my="md">
        <Center>
          <Paper withBorder>
            <Button
              leftIcon={<IconPlus />}
              variant="white"
              color="teal"
              onClick={handleAddAccount}
            >
              Добавить аккаунт
            </Button>
          </Paper>
        </Center>
      </Container>
      <AccountForm visible={visible} onClose={handleClose} />
    </>
  );
};
export default Accounts;
