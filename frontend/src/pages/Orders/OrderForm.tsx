import {
  Button,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import InstrumentAutocomplete from "../../components/InstrumentAutocomplete";

interface OrderFormProps {
  onSuccess: (data: any) => void;
  isLoading: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSuccess, isLoading }) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      figi: "",
      price: "",
      isLimit: true,
      lots: 1,
      direction: "sell",
    },
  });

  const isLimit = watch("isLimit");

  return (
    <form onSubmit={handleSubmit(onSuccess)}>
      <Stack spacing="xs">
        <InstrumentAutocomplete
          control={control}
          label="Инструмент"
          required
          name="figi"
        />
        <Controller
          control={control}
          name="isLimit"
          render={({ field: { value, ...rest } }) => (
            <Switch {...rest} checked={value} label="Лимитная заявка" />
          )}
        />
        {isLimit && (
          <Controller
            control={control}
            name="price"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                withAsterisk
                error={fieldState.error?.message}
                label="Цена"
                placeholder="1200"
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="lots"
          render={({ field }) => (
            <NumberInput
              {...field}
              min={0}
              withAsterisk
              label="Количество лотов"
            />
          )}
        />
        <Controller
          control={control}
          name="direction"
          render={({ field }) => (
            <Select
              withAsterisk
              label="Направление"
              data={[
                { value: "sell", label: "Продажа" },
                { value: "buy", label: "Покупка" },
              ]}
              {...field}
            />
          )}
        />
        <Button type="submit" loading={isLoading}>
          Создать
        </Button>
      </Stack>
    </form>
  );
};

export default OrderForm;
