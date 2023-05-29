import { Divider, Group, Stack, Text } from "@mantine/core";
import OperationCard from "../../components/OperationCard";
import { OperationProps } from "./OperationFactory";
import { withCurrency, asRuNumber } from "../../utils/strings";

const BuySell: React.FC<OperationProps> = ({ operation }) => {
  const topText = `${operation.type == "BUY" ? "Покупка" : "Продажа"} ${
    operation.quantity
  } лотов ${operation.instrument?.name}`;
  const bottomText = `Брокерский счет`;

  const affix = (
    <Stack spacing={0} fz="sm">
      <Divider />
      <Group position="apart">
        <Text>Количество лотов</Text>
        <Text>{asRuNumber(operation.quantity)} шт.</Text>
      </Group>
      <Group position="apart">
        <Text>Цена</Text>
        <Text>{withCurrency(operation.price, operation.currency)}</Text>
      </Group>
      {operation.commission && (
        <Group position="apart">
          <Text>Комиссия</Text>
          <Text>{withCurrency(operation.commission, operation.currency)}</Text>
        </Group>
      )}
      <Divider
        labelPosition="center"
        variant="dashed"
        label={`${operation.trades.length} ${
          operation.trades.length > 1 ? "сделки" : "сделка"
        }`}
      />
      {operation.trades.map((trade, key) => (
        <Group position="apart" key={key}>
          <Text>{new Date(trade.date).toLocaleString("ru-RU")}</Text>
          <Text>
            {asRuNumber(trade.quantity)} шт. по{" "}
            {withCurrency(trade.price, operation.currency)}
          </Text>
        </Group>
      ))}
    </Stack>
  );

  return (
    <OperationCard
      {...operation}
      topText={topText}
      bottomText={bottomText}
      avatarSrc={operation.instrument?.image_link}
      affix={affix}
    />
  );
};
export default BuySell;
