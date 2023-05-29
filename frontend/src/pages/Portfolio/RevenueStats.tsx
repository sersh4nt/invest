import { Skeleton, Text, ThemeIcon } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import { useGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet } from "../../api/operations/operations";
import Stats from "../../components/Stats";
import useSubaccount from "../../hooks/useSubaccount";
import { withCurrency } from "../../utils/strings";

const RevenueStats: React.FC = () => {
  const { subaccount } = useSubaccount();

  const { data, isLoading } =
    useGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet(
      Number(subaccount)
    );

  const DiffIcon =
    data?.profit ?? 0 > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Skeleton visible={isLoading || !data}>
      <Stats
        title="Общая прибыль"
        icon={
          data?.profit != undefined ? (
            <ThemeIcon
              color="gray"
              variant="light"
              size={38}
              radius="md"
              sx={(theme) => ({
                color:
                  data?.profit > 0 ? theme.colors.teal[6] : theme.colors.red[6],
              })}
            >
              <DiffIcon size="1.8rem" stroke={1.5} />
            </ThemeIcon>
          ) : undefined
        }
        value={withCurrency(data?.profit ?? 0, "rub")}
        addContent={
          <Text>
            {withCurrency(data?.daily_volume ?? 0, "rub")} объем торгов за день
          </Text>
        }
      />
    </Skeleton>
  );
};

export default RevenueStats;
