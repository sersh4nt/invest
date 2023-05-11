import { JsonInput } from "@mantine/core";
import { useState } from "react";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

interface ParseJSONFieldProps {
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean | string;
}

const ParseJSONField = ({
  field,
  fieldState,
  description,
  placeholder,
  label,
  required,
}: ParseJSONFieldProps) => {
  const [text, setText] = useState(JSON.stringify(field.value));

  const handleChange = (e: any) => {
    setText(e);
    try {
      field.onChange(JSON.parse(e));
    } catch (err) {
      field.onChange(null);
    }
  };

  return (
    <JsonInput
      {...field}
      value={text}
      onChange={handleChange}
      error={fieldState.error?.message}
      description={description}
      placeholder={placeholder}
      label={label}
      withAsterisk={!!required}
    />
  );
};

export default ParseJSONField;
