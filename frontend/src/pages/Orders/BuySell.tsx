import { Divider, Group, Stack, Text } from "@mantine/core";
import OperationCard from "../../components/OperationCard";
import { OperationProps } from "./OperationFactory";
import { capitalize } from "lodash";
import { withCurrency, asRuNumber } from "../../utils/strings";

const BuySell: React.FC<OperationProps> = ({ operation }) => {
  const topText = `${capitalize(operation.type)} ${
    operation.quantity
  } lots of ${operation.instrument?.name}`;
  const bottomText = `Broker account`;

  const affix = (
    <Stack spacing={0} fz="sm">
      <Divider />
      <Group position="apart">
        <Text>Lots</Text>
        <Text>{asRuNumber(operation.quantity)} pc.</Text>
      </Group>
      <Group position="apart">
        <Text>Price</Text>
        <Text>{withCurrency(operation.price, operation.currency)}</Text>
      </Group>
      {operation.commission && (
        <Group position="apart">
          <Text>Commission</Text>
          <Text>{withCurrency(operation.commission, operation.currency)}</Text>
        </Group>
      )}
      <Divider
        labelPosition="center"
        variant="dashed"
        label={`${operation.trades.length} trade${
          operation.trades.length > 1 ? "s" : ""
        }`}
      />
      {operation.trades.map((trade, key) => (
        <Group position="apart" key={key}>
          <Text>{new Date(trade.date).toLocaleString("ru-RU")}</Text>
          <Text>
            {asRuNumber(trade.quantity)} pc.,{" "}
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
