import { useParams } from "react-router-dom";
import {
  useGetWorkerLogsApiV1WorkersWorkerIdLogsGet,
  useGetWorkerStatusApiV1WorkersWorkerIdStatusGet,
} from "../../api/robots/robots";
import { Badge, Card, Center, Group, Skeleton, Text } from "@mantine/core";
import { useState } from "react";

const WorkerLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [logsSince, setLogsSince] = useState<string | undefined>(undefined);

  const { workerId } = useParams();
  const { data: status } = useGetWorkerStatusApiV1WorkersWorkerIdStatusGet(
    Number(workerId)
  );

  const { isLoading } = useGetWorkerLogsApiV1WorkersWorkerIdLogsGet(
    Number(workerId),
    { logsSince },
    {
      query: {
        refetchInterval: 500,
        onSuccess: (data) => {
          setLogs((p) => [
            ...p,
            ...data
              .filter((item) =>
                logsSince == undefined
                  ? true
                  : new Date(item.date) > new Date(logsSince)
              )
              .map((item) => item.message),
          ]);
          setLogsSince(data.at(-1)?.date);
        },
      },
    }
  );

  return (
    <Skeleton visible={isLoading} h="100%">
      <Card
        withBorder
        padding="md"
        sx={{ maxHeight: "calc(100vh - 54px - 2.1rem)", height: "100%" }}
      >
        <Card.Section withBorder p="sm">
          <Group position="apart">
            <Text>Worker logs</Text>
            <Badge
              size="lg"
              variant="outline"
              color={
                status == "running"
                  ? "teal"
                  : status == "created"
                  ? "yellow"
                  : "red"
              }
            >
              {status}
            </Badge>
          </Group>
        </Card.Section>
        <Card.Section pl="sm" h="calc(100% - 1.5rem)">
          <div
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            {logs.length > 0 ? (
              logs.map((item, key) => (
                <Text key={key} sx={{ flexShrink: 0 }}>
                  {item}
                </Text>
              ))
            ) : (
              <Center h="100%">
                <Text>No logs found</Text>
              </Center>
            )}
          </div>
        </Card.Section>
      </Card>
    </Skeleton>
  );
};
export default WorkerLogs;
