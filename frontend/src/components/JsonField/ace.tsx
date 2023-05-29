import AceEditor from "react-ace";
import * as ace from "ace-builds/src-noconflict/ace";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";
import { useState } from "react";
import { Input, Paper } from "@mantine/core";
import { FormInputProps } from "../../data/types";

ace.config.set("basePath", "/node_modules/ace-builds/src-min-noconflict");

interface JsonFieldProps extends FormInputProps {}

interface ParseJsonFieldProps {
  field: ControllerRenderProps;
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
}: ParseJsonFieldProps) => {
  const [text, setText] = useState(JSON.stringify(field.value, undefined, 2));

  const handleChange = (e: any) => {
    setText(e);
    try {
      field.onChange(JSON.parse(e));
    } catch (err) {
      field.onChange(null);
    }
  };

  return (
    <Input.Wrapper
      withAsterisk={!!required}
      label={label}
      description={description}
      error={fieldState?.error?.message}
    >
      <Paper withBorder radius="sm">
        <AceEditor
          mode="json"
          theme={"light"}
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          highlightActiveLine
          showGutter={false}
          width="100%"
          height="400px"
          maxLines={10}
          minLines={5}
          showPrintMargin={false}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </Paper>
    </Input.Wrapper>
  );
};

const JsonField: React.FC<JsonFieldProps> = ({
  control,
  name,
  required,
  label,
  description,
  placeholder,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <ParseJSONField
          field={field}
          fieldState={fieldState}
          label={label}
          description={description}
          placeholder={placeholder}
          required={!!required}
        />
      )}
    />
  );
};

export default JsonField;
