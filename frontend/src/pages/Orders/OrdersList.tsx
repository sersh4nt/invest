import { Text, Group, Stack, ActionIcon, Divider, Center } from "@mantine/core";
import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet } from "../../api/operations/operations";
import useSubaccount from "../../hooks/useSubaccount";
import OrderCard from "./OrderCard";

const OrdersList: React.FC = () => {
  const { subaccount } = useSubaccount();

  const { data, isLoading, refetch } =
    useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet(
      Number(subaccount)
    );

  const handleRefetch = () => refetch();

  return (
    <div style={{ height: "100%", background: "#fff" }}>
      <Stack spacing="xs" h="100%" p="sm">
        <Group position="apart" m={0}>
          <Text>Active orders</Text>
          <Group spacing="xs">
            <ActionIcon loading={isLoading}>
              <IconRefresh onClick={handleRefetch} />
            </ActionIcon>
            <ActionIcon>
              <IconTrash color="red" />
            </ActionIcon>
          </Group>
        </Group>
        <Divider my={4} />
        {data && data?.length > 0 ? (
          data.map((item, key) => <OrderCard data={item} key={key} />)
        ) : (
          <Center my="auto">
            <Text>No active orders found</Text>
          </Center>
        )}
      </Stack>
    </div>
  );
};

export default OrdersList;
