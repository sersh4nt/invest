import { Button, Container, Stack } from "@mantine/core";
import { useForm } from "react-hook-form";
import { useInitBacktestTaskApiV1BacktestPost } from "../../api/backtest/backtest";
import DateRangeInput from "../../components/DateRangeInput";
import InstrumentAutocomplete from "../../components/InstrumentAutocomplete";
import JsonField from "../../components/JsonField/ace";
import NumberInput from "../../components/NumberInput";
import RobotsInput from "../../components/RobotsInput";
import SelectInput from "../../components/SelectInput";

interface BacktestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BacktestForm: React.FC<BacktestFormProps> = ({ onSuccess }) => {
  const { mutateAsync, isLoading } = useInitBacktestTaskApiV1BacktestPost();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      figi: "",
      date_range: "",
      interval_raw: "",
      robot_id: null,
      robot_config: {},
      broker_fee: 0.3,
      initial_capital: 1000000,
    },
  });

  const onSubmit = async (data: any) => {
    const { date_range, robot_id, ...others } = data;
    const date_from = date_range[0].toISOString();
    const date_to = date_range[1].toISOString();
    try {
      await mutateAsync({
        data: { ...others, date_from, date_to, robot_id: Number(robot_id) },
      });
      onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container size="xs" sx={{ minHeight: 500 }} p={0}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="xs">
          <InstrumentAutocomplete
            control={control}
            label="Инструмент"
            required
            name="figi"
          />
          <DateRangeInput
            control={control}
            required
            label="Диапазон тестирования"
            name="date_range"
          />
          <SelectInput
            control={control}
            name="interval_raw"
            required
            label="Интервал свечей"
            options={[
              { value: "1min", label: "1 минута" },
              { value: "5min", label: "5 минут" },
              { value: "15min", label: "15 минут" },
              { value: "hour", label: "1 час" },
              { value: "day", label: "1 день" },
            ]}
          />
          <RobotsInput
            control={control}
            name="robot_id"
            label="Робот"
            placeholder="Выберете робота из списка"
            required
          />
          <NumberInput
            control={control}
            name="broker_fee"
            label="Комиссия брокера, %"
            min={0}
            max={100}
            step={0.01}
          />
          <NumberInput
            control={control}
            name="initial_capital"
            label="Начальные средства, ₽"
            min={0}
          />
          <JsonField
            control={control}
            label="Настройки робота"
            name="robot_config"
            required
          />
          <Button type="submit" loading={isLoading}>
            Начать тестирование
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default BacktestForm;
