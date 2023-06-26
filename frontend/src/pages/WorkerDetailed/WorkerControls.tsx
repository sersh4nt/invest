import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconReload,
} from "@tabler/icons-react";
import React from "react";
import { useParams } from "react-router";
import {
  useGetWorkerStatusApiV1WorkersWorkerIdStatusGet,
  useRestartWorkerApiV1WorkersWorkerIdRestartPost,
  useStartWorkerApiV1WorkersWorkerIdStartPost,
  useStopWorkerApiV1WorkersWorkerIdStopPost,
} from "../../api/robots/robots";

interface WorkerControlsProps {
  status: string;
  workerId: number;
}

const WorkerRestartButton: React.FC<WorkerControlsProps> = ({ workerId }) => {
  const { mutateAsync: restartWorker } =
    useRestartWorkerApiV1WorkersWorkerIdRestartPost();

  const handleRestart = async () => {
    try {
      await restartWorker({ workerId: Number(workerId) });
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
  );
};

const WorkerStartStopButton: React.FC<WorkerControlsProps> = ({
  status,
  workerId,
}) => {
  const { mutateAsync: startWorker, isLoading: isStarting } =
    useStartWorkerApiV1WorkersWorkerIdStartPost();

  const { mutateAsync: stopWorker, isLoading: isStopping } =
    useStopWorkerApiV1WorkersWorkerIdStopPost();

  const handleStart = async () => {
    try {
      await startWorker({ workerId });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStop = async () => {
    try {
      await stopWorker({ workerId });
    } catch (err) {
      console.log(err);
    }
  };

  return status === "running" ? (
    <Tooltip label="Остановить" withArrow>
      <ActionIcon
        color="red"
        size="lg"
        variant="outline"
        onClick={handleStop}
        loading={isStopping}
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
        loading={isStarting}
      >
        <IconPlayerPlay size="2rem" />
      </ActionIcon>
    </Tooltip>
  );
};

const WorkerControls: React.FC = () => {
  const { workerId } = useParams();
  const { data: status } = useGetWorkerStatusApiV1WorkersWorkerIdStatusGet(
    Number(workerId),
    { query: { refetchInterval: 500 } }
  );

  return (
    <Group position="apart">
      <Text>Управление роботом</Text>
      <Group align="center">
        <WorkerStartStopButton
          status={status ?? "stopped"}
          workerId={Number(workerId)}
        />
        <WorkerRestartButton
          status={status ?? "stopped"}
          workerId={Number(workerId)}
        />
      </Group>
    </Group>
  );
};

export default WorkerControls;
