import { Skeleton } from "@mantine/core";
import { useSelector } from "react-redux";
import { useGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet } from "../../api/operations/operations";
import Stats from "../../components/Stats";
import { activeSubaccountSelector } from "../../store/subaccountSlice";

const OrdersStats: React.FC = () => {
  const subaccount = useSelector(activeSubaccountSelector);

  const { data, isLoading } =
    useGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet(
      Number(subaccount)
    );

  return (
    <Skeleton visible={isLoading}>
      <Stats
        title="Daily orders completed"
        icon="orders"
        value={`${data?.daily_count}`}
        diff={data?.total_commission ?? 0}
        additionalText="Comission paid"
        withDiffIcon={false}
        withPercent={false}
      />
    </Skeleton>
  );
};

export default OrdersStats;
