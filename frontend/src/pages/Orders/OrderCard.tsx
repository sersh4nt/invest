import { Avatar, Text, Flex, Paper, Stack, Group } from "@mantine/core";
import { capitalize } from "lodash";
import { ActiveOrderScheme } from "../../models";
import { memo } from "react";
import { withCurrency } from "../../utils/strings";

interface OrderCardProps {
  data: ActiveOrderScheme;
}

const OrderCard: React.FC<OrderCardProps> = ({ data }) => {
  return (
    <Paper
      radius="sm"
      p={8}
      style={{ background: "rgb(73, 80, 87)", color: "#fff" }}
    >
      <Flex fz="sm" wrap="nowrap" gap={6}>
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
            <Text color={data.price > 0 ? "teal" : "inherit"}>
              {withCurrency(data.price, data.instrument.currency)}
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
      </Flex>
    </Paper>
  );
};

export default memo(OrderCard);
