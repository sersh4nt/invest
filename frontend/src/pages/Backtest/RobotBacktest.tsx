import { SimpleGrid, Skeleton, Text } from "@mantine/core";
import { useListRobotBacktestsApiV1RobotsRobotIdBacktestsGet } from "../../api/robots/robots";
import BacktestCard from "./BacktestCard";

interface RobotBacktestProps {
  robotId?: string;
}

const RobotBacktest: React.FC<RobotBacktestProps> = ({ robotId }) => {
  const { data, isLoading } =
    useListRobotBacktestsApiV1RobotsRobotIdBacktestsGet(Number(robotId));
  return (
    <Skeleton visible={isLoading} height="100%">
      {(data?.backtests.length ?? 0) > 0 ? (
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: "lg", cols: 2 },
            { minWidth: "xl", cols: 3 },
          ]}
        >
          {data &&
            data.backtests
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((item, key) => <BacktestCard backtest={item} key={key} />)}
        </SimpleGrid>
      ) : (
        <Text>
          У данного робота нет тестовых данных. Вы можете начать новое
          тестирование
        </Text>
      )}
    </Skeleton>
  );
};

export default RobotBacktest;
