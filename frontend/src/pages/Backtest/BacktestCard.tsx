import {
  Avatar,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { BacktestRead } from "../../models";
import { asRuNumber, withCurrency } from "../../utils/strings";

interface BacktestCardProps {
  backtest: BacktestRead;
}

const BacktestCard: React.FC<BacktestCardProps> = ({ backtest }) => {
  const periodDays = Math.max(
    1,
    (new Date(backtest.date_to).getTime() -
      new Date(backtest.date_from).getTime()) /
      (1000 * 3600 * 24)
  );

  const yearRelativeYield = ((backtest.relative_yield ?? 0) / periodDays) * 365;

  return (
    <Card withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text>{`Отчет о тестировании ${backtest.id?.slice(0, 8)}`}</Text>
          {backtest.relative_yield && (
            <Tooltip label="Среднегодовая доходность" withArrow>
              <Badge color={backtest.relative_yield > 0 ? "teal" : "red"}>
                {asRuNumber(yearRelativeYield)}%
              </Badge>
            </Tooltip>
          )}
          {}
          {backtest.is_finished ? null : backtest.is_started ? (
            <Badge color="yellow">Тестируется</Badge>
          ) : (
            <Badge color="red">Не начато</Badge>
          )}
        </Group>
      </Card.Section>
      <Card.Section withBorder inheritPadding py="xs">
        <Stack>
          <Text>
            Диапазин тестирования:{" "}
            {new Date(backtest.date_from).toLocaleDateString("ru-RU")} -{" "}
            {new Date(backtest.date_to).toLocaleDateString("ru-RU")} (
            {periodDays} дней)
          </Text>
          <Text>Разрешение свечей: {backtest.interval_raw}</Text>
          <Text>
            Начальные средства:{" "}
            {withCurrency(backtest.initial_capital ?? 0, "rub")}
          </Text>
          <Group>
            <Text>Инструмент: </Text>
            <Group spacing="xs">
              <Avatar src={backtest.instrument?.image_link} size={30} />
              <Text>
                {backtest.instrument?.name} ({backtest.instrument?.ticker})
              </Text>
            </Group>
          </Group>
        </Stack>
      </Card.Section>
      {backtest.is_finished && (
        <Card.Section withBorder inheritPadding py="sm">
          <Stack>
            <Text>
              Стоимость портфеля:{" "}
              {withCurrency(backtest.results.portfolio.total_cost ?? 0, "rub")}
            </Text>
            <Text>
              Прибыль:{" "}
              <Text
                span
                color={(backtest.relative_yield ?? 0) > 0 ? "teal" : "red"}
              >
                {withCurrency(backtest.absolute_yield ?? 0, "rub")} (
                {asRuNumber(backtest.relative_yield ?? 0)}%) ~{" "}
                {asRuNumber(yearRelativeYield)}%/г.
              </Text>
            </Text>
            <Text>Количество сделок: {backtest.results.operations.length}</Text>
            {backtest.time_elapsed && (
              <Text>
                Время тестирования: {asRuNumber(backtest.time_elapsed / 60)} минуты
              </Text>
            )}
          </Stack>
        </Card.Section>
      )}
    </Card>
  );
};

export default BacktestCard;
