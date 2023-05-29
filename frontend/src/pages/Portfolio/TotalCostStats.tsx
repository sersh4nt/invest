import { Skeleton, Text, ThemeIcon } from "@mantine/core";
import { useGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet } from "../../api/portfolio/portfolio";
import Stats from "../../components/Stats";
import useSubaccount from "../../hooks/useSubaccount";
import { withCurrency, asRuNumber } from "../../utils/strings";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";

const TotalCostStats: React.FC = () => {
  const { subaccount } = useSubaccount();

  const { data, isLoading } =
    useGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet(
      Number(subaccount)
    );

  const DiffIcon =
    data?.daily_gain ?? 0 > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Skeleton visible={isLoading || !data}>
      <Stats
        title="Стоимость портфеля"
        value={withCurrency(data?.cost ?? 0, "rub")}
        icon={
          data?.daily_gain != undefined ? (
            <ThemeIcon
              color="gray"
              variant="light"
              size={38}
              radius="md"
              sx={(theme) => ({
                color:
                  data?.daily_gain > 0
                    ? theme.colors.teal[6]
                    : theme.colors.red[6],
              })}
            >
              <DiffIcon size="1.8rem" stroke={1.5} />
            </ThemeIcon>
          ) : undefined
        }
        addContent={
          data?.daily_gain != undefined ? (
            <Text>
              <Text span color={data.daily_gain < 0 ? "red" : "teal"}>
                {asRuNumber(data.daily_gain)}%
              </Text>{" "}
              с начала дня
            </Text>
          ) : undefined
        }
      />
    </Skeleton>
  );
};

export default TotalCostStats;
