import { Skeleton, Text, ThemeIcon } from "@mantine/core";
import { IconSettings2 } from "@tabler/icons-react";
import { useGetActiveWorkersCountApiV1WorkersStatsActiveGet } from "../../api/robots/robots";
import Stats from "../../components/Stats";

const WorkerStats: React.FC = () => {
  const { data, isLoading } =
    useGetActiveWorkersCountApiV1WorkersStatsActiveGet();

  return (
    <Skeleton visible={isLoading}>
      <Stats
        title="Активные роботы"
        icon={
          <ThemeIcon color="gray" variant="light" size={38} radius="md">
            <IconSettings2 size="1.8rem" stroke={1.5} />
          </ThemeIcon>
        }
        value={(data?.running ?? 0).toString()}
        addContent={
          <Text>
            {Object.entries(data ?? {}).reduce(
              (cnt, [_, v]) => (cnt += Number(v)),
              0
            )}{" "}
            всего роботов
          </Text>
        }
      />
    </Skeleton>
  );
};

export default WorkerStats;
