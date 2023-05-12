import { useParams } from "react-router-dom";
import { useGetWorkerStatusApiV1WorkersWorkerIdStatusGet } from "../../api/robots/robots";
import { Badge, Card, Center, Group, Skeleton, Text } from "@mantine/core";
import { useState } from "react";

const WorkerLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [logsSince, setLogsSince] = useState<string | undefined>(undefined);

  const { workerId } = useParams();
  const { data, isLoading } = useGetWorkerStatusApiV1WorkersWorkerIdStatusGet(
    Number(workerId),
    { logsSince },
    {
      query: {
        refetchInterval: 1000,
        onSuccess: (data) => {
          const { logs } = data;
          setLogs((p) => [...p, ...logs.map((item) => item.message)]);
          setLogsSince(logs.at(-1)?.date);
        },
      },
    }
  );

  return (
    <Skeleton visible={isLoading}>
      <Card withBorder padding="md" sx={{ minHeight: "20vh" }}>
        <Card.Section withBorder p="sm">
          <Group position="apart">
            <Text>Worker logs</Text>
            <Badge
              size="lg"
              variant="outline"
              color={data?.status == "running" ? "teal" : "red" ?? "yellow"}
            >
              {data?.status ?? "unknown"}
            </Badge>
          </Group>
        </Card.Section>
        <Card.Section sx={{ height: "100%" }}>
          {logs.length > 0 ? (
            logs.map((item, key) => <Text key={key}>{item}</Text>)
          ) : (
            <Center h="100%">
              <Text>No logs found</Text>
            </Center>
          )}
        </Card.Section>
      </Card>
    </Skeleton>
  );
};
export default WorkerLogs;
