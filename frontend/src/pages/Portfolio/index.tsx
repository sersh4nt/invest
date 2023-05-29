import { Grid, SimpleGrid } from "@mantine/core";
import BalanceChart from "./BalanceChart";
import OrdersStats from "./OrdersStats";
import PortfolioTable from "./PortfolioTable";
import RevenueStats from "./RevenueStats";
import TotalCostStats from "./TotalCostStats";
import WorkerStats from "./WorkerStats";
import useSubaccount from "../../hooks/useSubaccount";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import NoAccounts from "../../components/NoAccounts";
import NoSubaccount from "../../components/NoSubaccount";

const Portfolio: React.FC = () => {
  const { subaccount } = useSubaccount();
  const { data: accounts } = useGetAccountsListApiV1AccountsGet();

  if (!accounts?.length) {
    return <NoAccounts />;
  }

  if (!subaccount) {
    return <NoSubaccount />;
  }

  return (
    <Grid>
      <Grid.Col span={12} lg={4} xl={3}>
        <SimpleGrid cols={1}>
          <TotalCostStats />
          <RevenueStats />
          <OrdersStats />
          <WorkerStats />
        </SimpleGrid>
      </Grid.Col>
      <Grid.Col span={12} lg={8} xl={9}>
        <BalanceChart />
      </Grid.Col>
      <Grid.Col span={12}>
        <PortfolioTable />
      </Grid.Col>
    </Grid>
  );
};

export default Portfolio;
