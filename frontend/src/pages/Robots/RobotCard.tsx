import { ActionIcon, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { RobotScheme } from "../../models";
import { IconPlus } from "@tabler/icons-react";

interface RobotCardProps {
  robot: RobotScheme;
  addRobot: (robotId: number) => void;
}

const RobotCard: React.FC<RobotCardProps> = ({ robot, addRobot }) => {
  const handleAddRobot = () => addRobot(robot.id);

  return (
    <Card radius="sm" padding="md" withBorder>
      <Card.Section p="md" withBorder>
        <Group position="apart">
          <Text>Name: {robot.name}</Text>
          <Tooltip label="Create worker using this robot" withArrow>
            <ActionIcon onClick={handleAddRobot} variant="outline">
              <IconPlus color="teal" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Stack>
          <Group position="apart">
            <Text>Created by:</Text>
            <Text>{robot.creator}</Text>
          </Group>
          {robot.used_by && (
            <Group position="apart">
              <Text>Used by:</Text>
              <Text>
                {robot?.used_by} user{robot.used_by > 1 ? "s" : ""}
              </Text>
            </Group>
          )}
        </Stack>
      </Card.Section>
      {robot.description && (
        <Card.Section>
          <Text>{robot.description}</Text>
        </Card.Section>
      )}
    </Card>
  );
};

export default RobotCard;
