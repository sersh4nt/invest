import { Select, SelectItem } from "@mantine/core";
import { FormInputProps } from "../../data/types";
import { Controller } from "react-hook-form";

interface SelectInputProps extends FormInputProps {
  options: SelectItem[];
}

const SelectInput: React.FC<SelectInputProps> = ({
  control,
  required,
  label,
  options,
  placeholder,
  description,
  name,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <Select
          {...field}
          data={options}
          error={fieldState.error?.message}
          label={label}
          placeholder={placeholder}
          description={description}
          withAsterisk={!!required}
        />
      )}
    />
  );
};

export default SelectInput;
