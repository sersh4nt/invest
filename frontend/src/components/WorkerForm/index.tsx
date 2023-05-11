import {
  Button,
  Checkbox,
  Container,
  Select,
  SelectItem,
  Stack,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useGetAccountsListApiV1AccountsGet } from "../../api/accounts/accounts";
import {
  useCreateWorkerApiV1WorkersPost,
  useListRobotsApiV1RobotsGet,
} from "../../api/robots/robots";
import useSubaccount from "../../hooks/useSubaccount";
import ParseJSONField from "../ParseJsonField";

interface WorkerFormProps {
  robotId?: string;
  onSuccess: (workerId: number) => void;
}

const WorkerForm: React.FC<WorkerFormProps> = ({ robotId, onSuccess }) => {
  const [robots, setRobots] = useState<SelectItem[]>([]);
  const [accounts, setAccounts] = useState<SelectItem[]>([]);
  const [settings, setSettings] = useState({});
  const { subaccount } = useSubaccount();

  const { data: rawRobots } = useListRobotsApiV1RobotsGet();
  const { data: rawAccounts } = useGetAccountsListApiV1AccountsGet();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      robot_id: robotId,
      subaccount_id: subaccount,
      config: settings,
      is_enabled: false,
    },
  });

  const { mutateAsync, isLoading } = useCreateWorkerApiV1WorkersPost();

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const response = await mutateAsync({ data });
      onSuccess(response.id);
      reset();
    } catch (err) {}
  };

  useEffect(() => {
    if (!rawRobots) {
      return;
    }
    const newRobots: SelectItem[] = rawRobots.items.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }));
    setRobots(newRobots);

    if (robotId) {
      const newSettings =
        rawRobots.items.find((v) => v.id.toString() == robotId)?.config ?? {};
      setSettings(newSettings);
    }
  }, [rawRobots, robotId]);

  useEffect(() => {
    if (!rawAccounts) {
      return;
    }
    const newAccounts: SelectItem[] = rawAccounts
      .map((acc) =>
        acc.subaccounts.map((item) => ({
          label: `Subaccount #${item.id}`,
          value: item.id.toString(),
        }))
      )
      .flat();
    setAccounts(newAccounts);
  }, [rawAccounts]);

  return (
    <Container size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="sm">
          <Controller
            rules={{ required: "This field is required!" }}
            control={control}
            name="robot_id"
            render={({ field }) => (
              <Select
                label="Select robot"
                data={robots}
                {...field}
                withAsterisk
              />
            )}
          />
          <Controller
            rules={{ required: "This field is required!" }}
            control={control}
            name="subaccount_id"
            render={({ field }) => (
              <Select
                label="Select subaccount"
                data={accounts}
                {...field}
                withAsterisk
              />
            )}
          />
          <Controller
            control={control}
            name="config"
            render={({ field, fieldState }) => (
              <ParseJSONField
                field={field}
                fieldState={fieldState}
                label="Settings"
                required
              />
            )}
          />
          <Controller
            control={control}
            name="is_enabled"
            render={({ field: { value, ...rest } }) => (
              <Checkbox label="Is enabled" {...rest} checked={value} />
            )}
          />
          <Button type="submit" loading={isLoading}>
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default WorkerForm;
