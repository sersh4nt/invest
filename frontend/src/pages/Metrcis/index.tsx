import { Tabs } from "@mantine/core";
import VolatilityTable from "./VolatilityTable";

const Metrics: React.FC = () => {
  return (
    <Tabs defaultValue="volatility" sx={{ background: "#fff" }}>
      <Tabs.List>
        <Tabs.Tab value="volatility">Волатильность</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="volatility" sx={{ width: "100%" }}>
        <VolatilityTable />
      </Tabs.Panel>
    </Tabs>
  );
};

export default Metrics;
