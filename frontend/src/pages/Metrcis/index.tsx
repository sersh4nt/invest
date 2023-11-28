import { Tabs } from "@mantine/core";
import VolatilityTable from "./VolatilityTable";
import ArbitrageTable from "./ArbitrageTable";

const Metrics: React.FC = () => {
  return (
    <Tabs defaultValue="volatility" sx={{ background: "#fff" }}>
      <Tabs.List>
        <Tabs.Tab value="volatility">Волатильность</Tabs.Tab>
        <Tabs.Tab value="arbitrage">Арбитраж</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="volatility" sx={{ width: "100%" }}>
        <VolatilityTable />
      </Tabs.Panel>
      <Tabs.Panel value="arbitrage" sx={{ width: "100%" }}>
        <ArbitrageTable />
      </Tabs.Panel>
    </Tabs>
  );
};

export default Metrics;
