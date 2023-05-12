import { Skeleton } from "@mantine/core";
import { useGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet } from "../../api/portfolio/portfolio";
import Stats from "../../components/Stats";
import useSubaccount from "../../hooks/useSubaccount";

const TotalCostStats: React.FC = () => {
  const { subaccount } = useSubaccount();

  const { data, isLoading } =
    useGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet(
      Number(subaccount)
    );

  return (
    <Skeleton visible={isLoading || !data}>
      <Stats
        title="Portfolio total cost"
        icon="wallet"
        value={`${data?.cost}`}
        diff={((data?.daily_gain ?? 0) - 1) * 100}
        additionalText="Since start of the day"
      />
    </Skeleton>
  );
};

export default TotalCostStats;
