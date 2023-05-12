import {
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  ScriptableContext,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

import {
  Button,
  Flex,
  Group,
  Paper,
  Select,
  Skeleton,
  Text,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet } from "../../api/portfolio/portfolio";
import useSubaccount from "../../hooks/useSubaccount";

ChartJS.register(
  Tooltip,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Filler,
  zoomPlugin
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { x: { type: "time" as const } },
  plugins: {
    zoom: {
      zoom: {
        mode: "x" as const,
        wheel: { enabled: true },
        drag: {
          enabled: true,
          backgroundColor: "rgba(128,128,128,0.2)",
        },
      },
    },
    legend: { display: false },
    filler: { propagate: false },
  },
};

interface ChartData {
  x: string;
  y: number;
}

const BalanceChart: React.FC = () => {
  const chartRef = useRef<ChartJS<"line", ChartData[]>>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [range, setRange] = useState<string>("today");

  const { subaccount } = useSubaccount();

  const { data, isLoading } =
    useListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet(
      Number(subaccount),
      { range }
    );

  const handleReset = () => {
    if (!chartRef.current) {
      return;
    }
    chartRef.current.resetZoom();
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    const newChartData = data.values.map((item) => ({
      x: item.ts,
      y: item.value,
    }));
    setChartData(newChartData);
  }, [data]);

  return (
    <Skeleton visible={isLoading}>
      <Paper withBorder h="315px" p="sm">
        <Group position="apart">
          <Text>Subaccount balance</Text>
          <Group>
            <Select
              size="xs"
              placeholder="Select date range"
              data={[
                { value: "today", label: "Today" },
                { value: "week", label: "This week" },
                { value: "month", label: "This month" },
                { value: "year", label: "This year" },
                { value: "all", label: "All values" },
              ]}
              value={range}
              onChange={(v) => setRange(v ?? "all")}
              w={120}
            />
            <Button onClick={handleReset} size="xs">
              Reset zoom
            </Button>
          </Group>
        </Group>
        <Flex sx={{ height: "calc(100% - 2rem)" }}>
          <Line
            ref={chartRef}
            height={undefined}
            width={undefined}
            data={{
              datasets: [
                {
                  data: chartData,
                  backgroundColor: (context: ScriptableContext<"line">) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, "rgba(234, 71, 237, 1)");
                    gradient.addColorStop(1, "rgba(234, 71, 237, 0.2)");
                    return gradient;
                  },
                  borderColor: "#d900ff",
                  fill: true,
                },
              ],
            }}
            options={options}
          />
        </Flex>
      </Paper>
    </Skeleton>
  );
};

export default BalanceChart;
