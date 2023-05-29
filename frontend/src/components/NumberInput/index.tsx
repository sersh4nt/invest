import { NumberInput as MantineNumberInput } from "@mantine/core";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../../data/types";

interface NumberInputProps extends FormInputProps {
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  control,
  name,
  required,
  label,
  placeholder,
  description,
  min,
  max,
  step,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <MantineNumberInput
          {...field}
          label={label}
          placeholder={placeholder}
          description={description}
          error={fieldState.error?.message}
          withAsterisk={!!required}
          min={min}
          max={max}
          step={step}
          precision={step?.toString().split(".")[1].length}
        />
      )}
    />
  );
};

export default NumberInput;
