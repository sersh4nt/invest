import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { RobotScheme } from "../../models";

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
          <Text>{robot.name}</Text>
          <Group>
            {robot.avg_yield && (
              <Tooltip
                transitionProps={{ duration: 200 }}
                withArrow
                multiline
                width={200}
                label="Cреднегодовая прибыль. Рассчитана на основании исторических данных"
              >
                <Badge color={robot.avg_yield > 0 ? "green" : "red"}>
                  {robot.avg_yield.toFixed(2)}%
                </Badge>
              </Tooltip>
            )}
            <Tooltip
              label="Создать робота на основе этого образа"
              withArrow
              width={150}
              transitionProps={{ duration: 200 }}
              multiline
            >
              <ActionIcon onClick={handleAddRobot} variant="outline">
                <IconPlus color="teal" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Stack>
          <Group position="apart">
            <Text>Создатель:</Text>
            <Text>{robot.creator}</Text>
          </Group>
          {robot.used_by && robot.used_by > 0 && (
            <Text>
              Исользован {robot?.used_by}{" "}
              {robot.used_by > 1 ? "пользователями" : "пользователем"}
            </Text>
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
