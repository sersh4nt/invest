import { Skeleton } from "@mantine/core";
import { useSelector } from "react-redux";
import { useGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet } from "../../api/portfolio/portfolio";
import Stats from "../../components/Stats";
import { activeSubaccountSelector } from "../../store/subaccountSlice";

const TotalCostStats: React.FC = () => {
  const subaccount = useSelector(activeSubaccountSelector);

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
