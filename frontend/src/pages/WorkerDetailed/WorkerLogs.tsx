import { Badge, Card, Group, Skeleton, Text } from "@mantine/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, FixedSizeList as List } from "react-window";
import {
  useGetWorkerLogsApiV1WorkersWorkerIdLogsGet,
  useGetWorkerStatusApiV1WorkersWorkerIdStatusGet,
} from "../../api/robots/robots";

interface LogMessageProps {
  text: string;
  style: any;
}

const LogMessage: React.FC<LogMessageProps> = ({ text, style }) => {
  return (
    <div style={style}>
      <Text
        sx={{
          flexShrink: 0,
          whiteSpace: "nowrap",
          fontFamily: "Consolas",
        }}
      >
        {text}
      </Text>
    </div>
  );
};

const WorkerLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [hasMoreLogs, setHasMoreLogs] = useState<boolean>(false);
  const [logsSince, setLogsSince] = useState<string | undefined>(undefined);
  const listRef = useRef<null | FixedSizeList>(null);

  const { workerId } = useParams();
  const { data: status } = useGetWorkerStatusApiV1WorkersWorkerIdStatusGet(
    Number(workerId)
  );

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(logs.length - 1);
      setHasMoreLogs(false);
    }
  }, [logs]);

  useEffect(() => {
    if (logs.length == 0 || !isInitial) return;
    setIsInitial(false);
    scrollToBottom();
  }, [logs]);

  const { isLoading } = useGetWorkerLogsApiV1WorkersWorkerIdLogsGet(
    Number(workerId),
    { logsSince },
    {
      query: {
        refetchInterval: 500,
        onSuccess: (data) => {
          const l1 = logs.length;
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
          if (logs.length != l1) setHasMoreLogs(true);
        },
      },
    }
  );

  const handleScroll = () => hasMoreLogs && setHasMoreLogs(false);

  return (
    <Skeleton visible={isLoading} h="100%">
      <Card
        withBorder
        padding="md"
        sx={{ maxHeight: "calc(100vh - 54px - 2.1rem)", height: "100%" }}
      >
        <Card.Section withBorder p="sm">
          <Group position="apart">
            <Group>
              <Text>Worker logs</Text>
              {hasMoreLogs && (
                <Badge
                  variant="outline"
                  color="yellow"
                  onClick={scrollToBottom}
                >
                  Есть новые логи
                </Badge>
              )}
            </Group>
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
          {/* <div
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
          </div> */}
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => (
              <List
                ref={listRef}
                width={width}
                height={height}
                itemCount={logs.length}
                itemSize={24}
                style={{ scrollBehavior: "smooth" }}
                onScroll={handleScroll}
              >
                {({ index, style }) => (
                  <LogMessage text={logs[index]} style={style} />
                )}
              </List>
            )}
          </AutoSizer>
        </Card.Section>
      </Card>
    </Skeleton>
  );
};
export default WorkerLogs;
