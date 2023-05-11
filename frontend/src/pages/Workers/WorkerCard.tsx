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
    <Card padding="md">
      <Card.Section withBorder p="md">
        <Group position="apart">
          <Text>Worker #{worker.id}</Text>
          <Tooltip label="Show worker" withArrow>
            <ActionIcon onClick={handleNavigate}>
              <IconCircleArrowUpRight />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Group position="apart">
          <Text>Image</Text>
          <Text>{worker.robot.image}</Text>
        </Group>
        <Group position="apart">
          <Text>Created by</Text>
          <Text>{worker.robot.creator}</Text>
        </Group>
      </Card.Section>
      <Card.Section p="md" withBorder>
        <Group position="apart">
          <Text>Subaccount</Text>
          <Text>#{worker.subaccount_id}</Text>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default WorkerCard;
