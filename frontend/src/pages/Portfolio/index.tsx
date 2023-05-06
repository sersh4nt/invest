import { Grid, SimpleGrid, Stack } from "@mantine/core";
import Stats from "../../components/Stats";
import BalanceChart from "./BalanceChart";
import OrdersStats from "./OrdersStats";
import PortfolioTable from "./PortfolioTable";
import RevenueStats from "./RevenueStats";
import TotalCostStats from "./TotalCostStats";

const Portfolio: React.FC = () => {
  return (
    <Stack>
      <Grid>
        <Grid.Col span={12} md={6} lg={5}>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <TotalCostStats />
            <RevenueStats />
            <OrdersStats />
            <Stats title="1" icon="discount" value="12300" diff={20} />
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
