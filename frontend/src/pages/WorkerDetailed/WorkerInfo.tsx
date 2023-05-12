import { Card, Skeleton, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useReadWorkerApiV1WorkersWorkerIdGet } from "../../api/robots/robots";

const WorkerInfo: React.FC = () => {
  const { workerId } = useParams();
  const { data, isLoading } = useReadWorkerApiV1WorkersWorkerIdGet(
    Number(workerId)
  );

  return (
    <Skeleton visible={isLoading || !data}>
      <Card withBorder padding="md">
        <Card.Section withBorder p="md">
          <Text>Worker #{data?.id}</Text>
          <Text>Image: {data?.robot.image}</Text>
        </Card.Section>
      </Card>
    </Skeleton>
  );
};

export default WorkerInfo;
