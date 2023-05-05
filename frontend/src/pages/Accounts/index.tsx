import { SimpleGrid, Skeleton } from "@mantine/core";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import AccountCard from "./AccountCard";

const Accounts: React.FC = () => {
  const { data, isLoading } = useGetAccountsListApiV1AccountsGet();
  console.log(data, isLoading);
  return (
    <Skeleton visible={isLoading}>
      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
      >
        {data?.map((acc, key) => (
          <AccountCard account={acc} key={key} />
        ))}
      </SimpleGrid>
    </Skeleton>
  );
};
export default Accounts;
