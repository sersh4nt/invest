import { SimpleGrid, Skeleton, Stack } from "@mantine/core";
import { useForm } from "react-hook-form";
import ArbitrageForm from "./ArbitrageForm";

import { useGetArbitrageDealsApiV1ArbitrageRateGet } from "../../api/arbitrage/arbitrage";
import ArbitrageCard from "./ArbitrageCard";

const Arbitrage: React.FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      deals: 1,
      symbols: ["USDT", "BTC", "BUSD", "BNB", "ETH", "RUB"],
      paymentMethods: ["RosBankNew", "TinkoffNew"],
      initialAmount: 5000,
      refetchInterval: 5000,
    },
  });

  const { refetchInterval, ...query } = watch();

  const { data, isLoading } = useGetArbitrageDealsApiV1ArbitrageRateGet(query, {
    query: { refetchInterval },
  });

  return (
    <Stack>
      <ArbitrageForm control={control} />
      <Skeleton visible={isLoading}>
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: "sm", cols: 2 },
            { minWidth: "md", cols: 3 },
            { minWidth: "lg", cols: 4 },
            { minWidth: "xl", cols: 5 },
          ]}
        >
          {data?.map((item, key) => (
            <ArbitrageCard result={item} key={key} />
          ))}
        </SimpleGrid>
      </Skeleton>
    </Stack>
  );
};

export default Arbitrage;
