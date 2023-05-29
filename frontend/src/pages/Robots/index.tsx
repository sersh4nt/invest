import { Modal, SimpleGrid, Skeleton, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListRobotsApiV1RobotsGet } from "../../api/robots/robots";
import WorkerForm from "../../components/WorkerForm";
import RobotCard from "./RobotCard";

const Robots: React.FC = () => {
  const navigate = useNavigate();
  const [robotId, setRobotId] = useState<string | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure();
  const { data, isLoading } = useListRobotsApiV1RobotsGet();

  const addRobot = (robot: number) => {
    setRobotId(robot.toString());
    open();
  };

  const handleSuccess = (workerId: number) => {
    close();
    navigate(`/workers/${workerId}`);
  };

  return (
    <>
      <Skeleton visible={isLoading}>
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: "xl", cols: 3 },
            { maxWidth: "md", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
        >
          {data?.items.map((robot, key) => (
            <RobotCard robot={robot} key={key} addRobot={addRobot} />
          ))}
        </SimpleGrid>
      </Skeleton>

      <Modal
        opened={opened}
        onClose={close}
        title={<Text>Добавить нового робота</Text>}
      >
        <WorkerForm onSuccess={handleSuccess} robotId={robotId} />
      </Modal>
    </>
  );
};

export default Robots;
