import { Card, JsonInput, Skeleton, Stack, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useReadWorkerApiV1WorkersWorkerIdGet } from "../../api/robots/robots";
import WorkerControls from "./WorkerControls";

const WorkerInfo: React.FC = () => {
  const { workerId } = useParams();
  const { data, isLoading } = useReadWorkerApiV1WorkersWorkerIdGet(
    Number(workerId)
  );

  return (
    <Skeleton visible={isLoading}>
      {data && (
        <Card withBorder padding="md">
          <Card.Section withBorder p="md">
            <Stack spacing="xs">
              <Text>Робот №{data.id}</Text>
              <Text>Образ: {data.robot.image}</Text>
              <Text>Название: {data.robot.name}</Text>
              <JsonInput
                formatOnBlur
                defaultValue={JSON.stringify(data.config, null, 2)}
                autosize
                label={
                  <Text fz="md" fw={500}>
                    Настройки робота
                  </Text>
                }
              />
              <Text>Привязан к счету №{data.subaccount_id}</Text>
            </Stack>
          </Card.Section>
          <Card.Section withBorder p="md">
            <WorkerControls />
          </Card.Section>
        </Card>
      )}
    </Skeleton>
  );
};

export default WorkerInfo;
