import { Grid, SimpleGrid, Stack } from "@mantine/core";
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
    <Stack>
      <Grid>
        <Grid.Col span={12} md={6} lg={5}>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <TotalCostStats />
            <RevenueStats />
            <OrdersStats />
            <WorkerStats />
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={12} md={6} lg={7}>
          <BalanceChart />
        </Grid.Col>
      </Grid>
      <PortfolioTable />
    </Stack>
  );
};

export default Portfolio;
