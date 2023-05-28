import { Paper, SegmentedControl, ScrollArea, Grid } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { useListRobotsApiV1RobotsGet } from "../../api/robots/robots";
import { RobotScheme } from "../../models";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

const Backtest: React.FC = () => {
  const matches = useMediaQuery("(min-width: 65em)");
  const navigate = useNavigate();
  const { data } = useListRobotsApiV1RobotsGet();

  useEffect(() => {
    if (data == undefined) {
      setRobots([]);
      return;
    }
    setRobots(data.items);
  }, [data]);

  const [robots, setRobots] = useState<RobotScheme[]>([]);

  return (
    <Paper
      sx={{ height: "calc(100vh - 54px - 2.25rem)", width: "100%" }}
    >
      <Grid gutter={0}>
        <Grid.Col span={matches ? "content" : 12} sx={{ paddingTop: 0 }}>
          <ScrollArea
            offsetScrollbars
            type="auto"
            sx={{ height: matches ? "calc(100vh - 54px - 2.25rem)" : "auto" }}
          >
            <SegmentedControl
              sx={{ height: "100%" }}
              onChange={(v) => navigate(`/backtest/${v}`)}
              orientation={matches ? "vertical" : "horizontal"}
              data={robots.map((item) => ({
                label: `Образ №${item.id}: ${item.name}`,
                value: item.id.toString(),
              }))}
            />
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={matches ? "auto" : 12} sx={{ height: "100%" }} mx={0}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default Backtest;
