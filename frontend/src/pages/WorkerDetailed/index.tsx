import { Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import WorkerInfo from "./WorkerInfo";
import WorkerLogs from "./WorkerLogs";

const WorkerDetailed: React.FC = () => {
  const matches = useMediaQuery("(min-width: 65em)");
  console.log(matches);

  return (
    <Flex direction={matches ? "row" : "column"} gap="md" h="100%">
      <div style={{ flex: "0 0 auto" }}>
        <WorkerInfo />
      </div>
      <div style={{ flex: "1" }}>
        <WorkerLogs />
      </div>
    </Flex>
  );
};

export default WorkerDetailed;
