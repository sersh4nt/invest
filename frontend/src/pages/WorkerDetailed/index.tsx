import { Grid } from "@mantine/core";
import WorkerLogs from "./WorkerLogs";
import WorkerInfo from "./WorkerInfo";

const WorkerDetailed: React.FC = () => {
  return (
    <Grid>
      <Grid.Col span={12} lg={8} sm={6} md={7}>
        <WorkerLogs />
      </Grid.Col>
      <Grid.Col span={12} lg={4} sm={6} md={5}>
        <WorkerInfo />
      </Grid.Col>
    </Grid>
  );
};

export default WorkerDetailed;
