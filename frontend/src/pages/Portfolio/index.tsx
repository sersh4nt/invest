import { Grid, SimpleGrid, Stack } from "@mantine/core";
import BalanceChart from "./BalanceChart";
import OrdersStats from "./OrdersStats";
import PortfolioTable from "./PortfolioTable";
import RevenueStats from "./RevenueStats";
import TotalCostStats from "./TotalCostStats";
import WorkerStats from "./WorkerStats";

const Portfolio: React.FC = () => {
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
