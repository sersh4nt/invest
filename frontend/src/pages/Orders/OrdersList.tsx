import {
  ActionIcon,
  Center,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "react-query";
import { useCancelAllOrdersApiV1SubaccountsSubaccountIdPost } from "../../api/accounts/accounts";
import {
  getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey,
  useCreateOrderApiV1SubaccountsSubaccountIdActiveOrdersPost,
  useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet,
} from "../../api/operations/operations";
import useSubaccount from "../../hooks/useSubaccount";
import OrderCard from "./OrderCard";
import OrderForm from "./OrderForm";

const OrdersList: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const client = useQueryClient();
  const { subaccount } = useSubaccount();

  const { data, isFetching, refetch } =
    useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet(
      Number(subaccount),
      { query: { refetchInterval: 10000 } }
    );

  const { mutateAsync: cancelAllOrders, isLoading } =
    useCancelAllOrdersApiV1SubaccountsSubaccountIdPost();

  const { mutateAsync: createOrder, isLoading: isOrderPlacing } =
    useCreateOrderApiV1SubaccountsSubaccountIdActiveOrdersPost();

  const handleRefetch = () => refetch();

  const handleCancel = async () => {
    try {
      await cancelAllOrders({ subaccountId: Number(subaccount) });
      client.invalidateQueries(
        getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey(
          Number(subaccount)
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateOrder = async (data: any) => {
    const { figi, price, isLimit, lots, direction } = data;
    try {
      await createOrder({
        subaccountId: Number(subaccount),
        data: {
          figi,
          quantity: lots,
          type: direction,
          is_limit: isLimit,
          price,
        },
      });
      client.invalidateQueries(
        getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey(
          Number(subaccount)
        )
      );
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Создать новую заявку">
        <OrderForm onSuccess={handleCreateOrder} isLoading={isOrderPlacing} />
      </Modal>
      <Stack h="100%" sx={{ background: "#fff" }} spacing={0}>
        <Group position="apart" p="sm">
          <Text>Активные заявки</Text>
          <Group spacing="xs">
            <ActionIcon>
              <IconPlus onClick={open} />
            </ActionIcon>
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
    </>
  );
};

export default OrdersList;
