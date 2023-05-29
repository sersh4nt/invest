import {
  ActionIcon,
  Flex,
  Modal,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import {
  getListRobotBacktestsApiV1RobotsRobotIdBacktestsGetQueryKey,
  useListRobotsApiV1RobotsGet,
} from "../../api/robots/robots";
import { RobotScheme } from "../../models";
import BacktestFilters from "./BacktestFilters";
import BacktestForm from "./BacktestForm";
import RobotBacktest from "./RobotBacktest";

const Backtest: React.FC = () => {
  const client = useQueryClient();
  const matches = useMediaQuery("(min-width: 65em)");
  const { data } = useListRobotsApiV1RobotsGet();
  const [opened, { open, close }] = useDisclosure();
  const [robots, setRobots] = useState<RobotScheme[]>([]);

  const [tab, setTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!data) {
      setRobots([]);
      return;
    }
    setRobots(data.items);
  }, [data]);

  const handleRefresh = () =>
    client.invalidateQueries(
      getListRobotBacktestsApiV1RobotsRobotIdBacktestsGetQueryKey(Number(tab))
    );

  return (
    <>
      <Flex
        direction={matches ? "row" : "column"}
        h="calc(100vh - 54px - 2.25rem)"
        gap="xs"
      >
        <ScrollArea
          offsetScrollbars
          type="auto"
          sx={{ height: matches ? "calc(100vh - 54px - 2.25rem)" : "auto" }}
        >
          <SegmentedControl
            value={tab}
            onChange={setTab}
            orientation={matches ? "vertical" : "horizontal"}
            data={robots.map((item) => ({
              label: `Образ №${item.id}: ${item.name}`,
              value: item.id.toString(),
            }))}
          />
        </ScrollArea>

        <Stack h="100%">
          <Flex direction="column" gap="sm">
            <Flex align="end" w="100%" gap="md" style={{ flex: "0 1 auto" }}>
              <BacktestFilters />
              <Tooltip label="Обновить данные" withArrow>
                <ActionIcon
                  variant="outline"
                  size="lg"
                  bg="#fff"
                  onClick={handleRefresh}
                >
                  <IconRefresh />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Начать новое тестирование" withArrow>
                <ActionIcon
                  color="teal"
                  variant="outline"
                  size="lg"
                  bg="#fff"
                  onClick={open}
                >
                  <IconPlus />
                </ActionIcon>
              </Tooltip>
            </Flex>
          </Flex>

          <div style={{ flex: "1", overflowY: "auto" }}>
            {tab != undefined ? (
              <RobotBacktest robotId={tab} />
            ) : (
              <Text>Выберете робота для просмотра статистики</Text>
            )}
          </div>
        </Stack>
      </Flex>
      <Modal opened={opened} onClose={close} title="Начать новое тестирование">
        <BacktestForm onSuccess={close} onCancel={close} />
      </Modal>
    </>
  );
};

export default Backtest;
