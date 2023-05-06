import { Skeleton } from "@mantine/core";
import { useSelector } from "react-redux";
import { useGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet } from "../../api/operations/operations";
import Stats from "../../components/Stats";
import { activeSubaccountSelector } from "../../store/subaccountSlice";

const RevenueStats: React.FC = () => {
  const subaccount = useSelector(activeSubaccountSelector);

  const { data, isLoading } =
    useGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet(
      Number(subaccount)
    );

  return (
    <Skeleton visible={isLoading || !data}>
      <Stats
        title="Overall profit"
        icon="profit"
        value={`${data?.profit}`}
        diff={data?.daily_volume ?? 0}
        additionalText="Daily volume"
        withPercent={false}
        withDiffIcon={false}
      />
    </Skeleton>
  );
};

export default RevenueStats;
