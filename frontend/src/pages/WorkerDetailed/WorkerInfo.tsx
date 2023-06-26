import { Button, Card, JsonInput, Skeleton, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useReadWorkerApiV1WorkersWorkerIdGet,
  useUpdateWorkerSettingsApiV1WorkersWorkerIdSettingsPut,
  getReadWorkerApiV1WorkersWorkerIdGetQueryKey,
} from "../../api/robots/robots";
import WorkerControls from "./WorkerControls";
import { useQueryClient } from "react-query";

const WorkerInfo: React.FC = () => {
  const queryClient = useQueryClient();
  const { workerId } = useParams();
  const { data, isLoading } = useReadWorkerApiV1WorkersWorkerIdGet(
    Number(workerId)
  );
  const { mutateAsync, isLoading: settingsUpdating } =
    useUpdateWorkerSettingsApiV1WorkersWorkerIdSettingsPut();

  const [settings, setSettings] = useState<string>(
    JSON.stringify(data?.config, undefined, 2)
  );

  const handleSaveSettings = async () => {
    try {
      await mutateAsync({
        workerId: Number(workerId),
        data: JSON.parse(settings),
      });
      queryClient.invalidateQueries(
        getReadWorkerApiV1WorkersWorkerIdGetQueryKey(Number(workerId))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Skeleton visible={isLoading}>
      {data && (
        <Card withBorder padding="md">
          <Card.Section withBorder p="md">
            <Stack spacing="xs">
              <Text>Робот №{data.id}</Text>
              <Text>Образ: {data.robot.image}</Text>
              <Text>Название: {data.robot.name}</Text>
              <JsonInput
                formatOnBlur
                defaultValue={JSON.stringify(data.config, undefined, 2)}
                value={settings}
                onChange={setSettings}
                autosize
                label={
                  <Text fz="md" fw={500}>
                    Настройки робота
                  </Text>
                }
              />
              <Button onClick={handleSaveSettings} loading={settingsUpdating}>
                Сохранить настройки
              </Button>
              <Text>Привязан к счету №{data.subaccount_id}</Text>
            </Stack>
          </Card.Section>
          <Card.Section withBorder p="md">
            <WorkerControls />
          </Card.Section>
        </Card>
      )}
    </Skeleton>
  );
};

export default WorkerInfo;
