import { ActionIcon, Card, Group, Text, Tooltip } from "@mantine/core";
import { IconCircleArrowUpRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { WorkerScheme } from "../../models";

interface WorkerCardProps {
  worker: WorkerScheme;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const naviagate = useNavigate();

  const handleNavigate = () => naviagate(`/workers/${worker.id}`);

  return (
    <Card padding="md" withBorder>
      <Card.Section withBorder p="md">
        <Group position="apart">
          <Text>Робот №{worker.id}</Text>
          <Tooltip label="Посмотреть детали" withArrow>
            <ActionIcon onClick={handleNavigate}>
              <IconCircleArrowUpRight />
            </ActionIcon>
          </Tooltip>
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
      </Card.Section>
      <Card.Section p="md" withBorder>
        <Group position="apart">
          <Text>Счет:</Text>
          <Text>№{worker.subaccount_id}</Text>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default WorkerCard;
