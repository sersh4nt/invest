import { Skeleton, ThemeIcon, Text } from "@mantine/core";
import { useGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet } from "../../api/operations/operations";
import Stats from "../../components/Stats";
import useSubaccount from "../../hooks/useSubaccount";
import { IconAd2 } from "@tabler/icons-react";
import { withCurrency } from "../../utils/strings";

const OrdersStats: React.FC = () => {
  const { subaccount } = useSubaccount();

  const { data, isLoading } =
    useGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet(
      Number(subaccount)
    );

  return (
    <Skeleton visible={isLoading}>
      <Stats
        title="Исполнено заявок сегодня"
        icon={
          <ThemeIcon color="gray" variant="light" size={38} radius="md">
            <IconAd2 size="1.8rem" stroke={1.5} />
          </ThemeIcon>
        }
        value={(data?.daily_count ?? 0).toString()}
        addContent={
          <Text>
            <Text color="red" inherit span>
              {withCurrency(data?.total_commission ?? 0, "rub")}
            </Text>{" "}
            комиссии
          </Text>
        }
      />
    </Skeleton>
  );
};

export default OrdersStats;
