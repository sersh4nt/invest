import { Skeleton } from "@mantine/core";
import Stats from "../../components/Stats";
import { useGetActiveWorkersCountApiV1WorkersStatsActiveGet } from "../../api/robots/robots";

const WorkerStats: React.FC = () => {
  const { data, isLoading } =
    useGetActiveWorkersCountApiV1WorkersStatsActiveGet();

  return (
    <Skeleton visible={isLoading}>
      <Stats
        title="Workers"
        icon="gear"
        value={(data?.active ?? 0).toString()}
        diff={Object.entries(data ?? {}).reduce(
          (cnt, [_, v]) => (cnt += Number(v)),
          0
        )}
        additionalText="Total workers"
        withPercent={false}
        withDiffIcon={false}
      />
    </Skeleton>
  );
};

export default WorkerStats;
