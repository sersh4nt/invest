import { Card, ScrollArea, Skeleton, SimpleGrid } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useListRobotBacktestsApiV1RobotsRobotIdBacktestsGet } from "../../api/robots/robots";

const RobotBacktest: React.FC = () => {
  const { robotId } = useParams();
  const { data, isLoading } =
    useListRobotBacktestsApiV1RobotsRobotIdBacktestsGet(Number(robotId));
  return (
    <Skeleton visible={isLoading}>
      <ScrollArea offsetScrollbars>
        <SimpleGrid cols={1}>
          {data &&
            data
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map((item, key) => (
                <Card withBorder key={key}>
                  123
                </Card>
              ))}
        </SimpleGrid>
      </ScrollArea>
    </Skeleton>
  );
};

export default RobotBacktest;
