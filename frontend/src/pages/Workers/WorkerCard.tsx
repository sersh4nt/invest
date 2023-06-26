import { ActionIcon, Badge, Card, Group, Text, Tooltip } from "@mantine/core";
import { IconCircleArrowUpRight, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  useDeleteWorkerApiV1WorkersWorkerIdDelete,
  getListWorkersApiV1WorkersGetQueryKey,
} from "../../api/robots/robots";
import { WorkerScheme } from "../../models";

interface WorkerCardProps {
  worker: WorkerScheme;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const naviagate = useNavigate();
  const { mutateAsync, isLoading } =
    useDeleteWorkerApiV1WorkersWorkerIdDelete();
  const queryClient = useQueryClient();

  const handleNavigate = () => naviagate(`/workers/${worker.id}`);

  const handleDelete = async () => {
    try {
      await mutateAsync({ workerId: worker.id });
      queryClient.invalidateQueries(getListWorkersApiV1WorkersGetQueryKey());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card padding="md" withBorder>
      <Card.Section withBorder p="md">
        <Group position="apart">
          <Text>Робот №{worker.id}</Text>
          <Group spacing="xs">
            {worker.status && (
              <Badge
                variant="outline"
                color={
                  worker.status == "running"
                    ? "teal"
                    : worker.status == "created"
                    ? "yellow"
                    : "red"
                }
              >
                {worker.status}
              </Badge>
            )}
            <Tooltip label="Посмотреть детали" withArrow>
              <ActionIcon onClick={handleNavigate}>
                <IconCircleArrowUpRight />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Удалить робота" withArrow>
              <ActionIcon
                onClick={handleDelete}
                color="red"
                loading={isLoading}
              >
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Group position="apart">
          <Text>Образ:</Text>
          <Text>{worker.robot.image}</Text>
        </Group>
        <Group position="apart">
          <Text>Создатель:</Text>
          <Text>{worker.robot.creator}</Text>
        </Group>
        <Text>Привязан к счету №{worker.subaccount_id}</Text>
      </Card.Section>
    </Card>
  );
};

export default WorkerCard;
