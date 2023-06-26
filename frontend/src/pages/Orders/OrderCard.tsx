import {
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { capitalize } from "lodash";
import { memo } from "react";
import { useQueryClient } from "react-query";
import {
  getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey,
  useCancelOrderApiV1CancelPost,
} from "../../api/operations/operations";
import useSubaccount from "../../hooks/useSubaccount";
import { ActiveOrderScheme } from "../../models";
import { withCurrency } from "../../utils/strings";

interface OrderCardProps {
  data: ActiveOrderScheme;
}

const OrderCard: React.FC<OrderCardProps> = ({ data }) => {
  const client = useQueryClient();
  const { subaccount } = useSubaccount();
  const { mutateAsync, isLoading } = useCancelOrderApiV1CancelPost();

  const handleCancel = async () => {
    try {
      const response = await mutateAsync({
        data: { order_id: data.broker_id, subaccount_id: Number(subaccount) },
      });
      if (response) {
        client.invalidateQueries(
          getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey(
            Number(subaccount)
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Paper
      radius="sm"
      p={8}
      style={{ background: "rgb(73, 80, 87)", color: "#fff" }}
    >
      <Flex fz="sm" wrap="nowrap" gap={8}>
        <Avatar
          radius="xl"
          size={40}
          src={data.instrument.image_link}
          color={data.direction == "BUY" ? "teal" : "red"}
        />
        <Stack
          spacing={0}
          style={{ flex: "1 0 0", width: "calc(100% - 46px)" }}
        >
          <Flex justify="space-between" direction="row-reverse" w="100%">
            <Text color={data.direction == "SELL" ? "teal" : "inherit"}>
              {withCurrency(data.direction == "SELL" ? data.price : -data.price, data.instrument.currency)}
            </Text>
            <Text truncate fw={500}>
              {data.instrument.ticker}
            </Text>
          </Flex>
          <Group position="apart">
            <Text truncate w="auto">
              {capitalize(data.direction)} {data.lots_requested} lot
              {data.lots_requested > 0 ? "s" : ""}
            </Text>
            <Text>
              {new Date(data.date).toLocaleTimeString("ru-RU", {
                timeStyle: "short",
              })}
            </Text>
          </Group>
        </Stack>
        <Tooltip label="Отменить заявку" withArrow>
          <ActionIcon
            my="auto"
            color="red"
            variant="outline"
            onClick={handleCancel}
            loading={isLoading}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Paper>
  );
};

export default memo(OrderCard);
