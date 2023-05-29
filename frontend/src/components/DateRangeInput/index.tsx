import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { FormInputProps } from "../../data/types";
import { Indicator } from "@mantine/core";

interface DateRangeInputProps extends FormInputProps {}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  name = "date_range",
  control,
  label,
  description,
  required,
}) => {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const handleChange = (v: any, changeCallback: (v: any) => void) => {
    changeCallback(v);
    setValue(v);
  };

  return (
    <Controller
      rules={{ required }}
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePickerInput
          type="range"
          value={value}
          onChange={(v) => handleChange(v, field.onChange)}
          label={label}
          description={description}
          error={fieldState.error?.message}
          withAsterisk={!!required}
          renderDay={(date) => (
            <Indicator
              size={6}
              color="red"
              offset={-5}
              disabled={date.getDate() != new Date().getDate()}
            >
              <div>{date.getDate()}</div>
            </Indicator>
          )}
          maxDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
        />
      )}
    />
  );
};

export default DateRangeInput;
