import { ActionIcon, Center, Divider, Group, Stack, Text } from "@mantine/core";
import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "react-query";
import { useCancelAllOrdersApiV1SubaccountsSubaccountIdPost } from "../../api/accounts/accounts";
import {
  getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey,
  useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet,
} from "../../api/operations/operations";
import useSubaccount from "../../hooks/useSubaccount";
import OrderCard from "./OrderCard";

const OrdersList: React.FC = () => {
  const client = useQueryClient();
  const { subaccount } = useSubaccount();

  const { data, isFetching, refetch } =
    useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet(
      Number(subaccount),
      { query: { refetchInterval: 10000 } }
    );

  const { mutateAsync, isLoading } =
    useCancelAllOrdersApiV1SubaccountsSubaccountIdPost();

  const handleRefetch = () => refetch();

  const handleCancel = async () => {
    try {
      await mutateAsync({ subaccountId: Number(subaccount) });
      client.invalidateQueries(
        getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey(
          Number(subaccount)
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack h="100%" sx={{ background: "#fff" }} spacing={0}>
      <Group position="apart" p="sm">
        <Text>Активные заявки</Text>
        <Group spacing="xs">
          <ActionIcon loading={isFetching}>
            <IconRefresh onClick={handleRefetch} />
          </ActionIcon>
          <ActionIcon onClick={handleCancel} loading={isLoading}>
            <IconTrash color="red" />
          </ActionIcon>
        </Group>
      </Group>
      <Divider m={0} mb="xs" />
      <Stack spacing="xs" style={{ flex: "1 1 0", overflowY: "auto" }}>
        {data && data?.length > 0 ? (
          data.map((item, key) => <OrderCard data={item} key={key} />)
        ) : (
          <Center my="auto">
            <Text>Нет ни одной активной заявки</Text>
          </Center>
        )}
      </Stack>
    </Stack>
  );
};

export default OrdersList;
