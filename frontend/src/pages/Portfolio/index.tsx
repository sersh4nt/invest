import { Grid, SimpleGrid, Stack } from "@mantine/core";
import Stats from "../../components/Stats";

// <Stats title="1" icon="discount" value="12300" diff={20} />
const Portfolio: React.FC = () => {
  return (
    <Stack>
      <Grid>
        <Grid.Col span={12} md={6} lg={5}>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <Stats title="1" icon="discount" value="12300" diff={20} />
            <Stats title="1" icon="discount" value="12300" diff={20} />
            <Stats title="1" icon="discount" value="12300" diff={20} />
            <Stats title="1" icon="discount" value="12300" diff={20} />
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={12} md={6} lg={7}>
          <Stats title="1" icon="discount" value="12300" diff={20} />
        </Grid.Col>
      </Grid>
      <Stats title="1" icon="discount" value="12300" diff={20} />
    </Stack>
  );
};

export default Portfolio;
