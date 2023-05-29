import { useEffect, useState } from "react";
import { useListRobotsApiV1RobotsGet } from "../../api/robots/robots";
import { FormInputProps } from "../../data/types";
import SelectInput from "../SelectInput";
import { SelectItem } from "@mantine/core";

const RobotsInput: React.FC<FormInputProps> = (props) => {
  const { data } = useListRobotsApiV1RobotsGet();
  const [options, setOptions] = useState<SelectItem[]>([]);

  useEffect(() => {
    if (!data) return;
    setOptions(
      data.items.map((robot) => ({
        value: robot.id.toString(),
        label: robot.name,
      }))
    );
  }, [data]);

  return <SelectInput {...props} options={options} />;
};

export default RobotsInput;
