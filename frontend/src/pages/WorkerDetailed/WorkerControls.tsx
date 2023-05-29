import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconReload,
} from "@tabler/icons-react";
import { useParams } from "react-router";
import {
  useGetWorkerStatusApiV1WorkersWorkerIdStatusGet,
  useRestartWorkerApiV1WorkersWorkerIdRestartPost,
  useStartWorkerApiV1WorkersWorkerIdStartPost,
  useStopWorkerApiV1WorkersWorkerIdStopPost,
} from "../../api/robots/robots";

const WorkerControls: React.FC = () => {
  const { workerId } = useParams();
  const { data: status } = useGetWorkerStatusApiV1WorkersWorkerIdStatusGet(
    Number(workerId),
    { query: { refetchInterval: 500 } }
  );

  const { mutateAsync: startWorker } =
    useStartWorkerApiV1WorkersWorkerIdStartPost();

  const { mutateAsync: stopWorker } =
    useStopWorkerApiV1WorkersWorkerIdStopPost();

  const { mutateAsync: restartWorker } =
    useRestartWorkerApiV1WorkersWorkerIdRestartPost();

  const handleStart = async () => {
    try {
      await startWorker({ workerId: Number(workerId) });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStop = async () => {
    try {
      await stopWorker({ workerId: Number(workerId) });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRestart = async () => {
    try {
      await restartWorker({ workerId: Number(workerId) });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Group position="apart">
      <Text>Управление роботом</Text>
      <Group align="center">
        {status == "running" ? (
          <Tooltip label="Остановить" withArrow>
            <ActionIcon
              color="red"
              size="lg"
              variant="outline"
              onClick={handleStop}
            >
              <IconPlayerStop size="2rem" />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Tooltip label="Запустить" withArrow>
            <ActionIcon
              color="teal"
              size="lg"
              variant="outline"
              onClick={handleStart}
            >
              <IconPlayerPlay size="2rem" />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label="Перезапустить" withArrow>
          <ActionIcon
            color="yellow"
            size="lg"
            variant="outline"
            onClick={handleRestart}
          >
            <IconReload size="2rem" />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
};

export default WorkerControls;
