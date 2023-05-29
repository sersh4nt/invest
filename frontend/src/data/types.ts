import { Control } from "react-hook-form";

export interface FormInputProps {
  control: Control<any>;
  label: string;
  description?: string;
  required?: string | boolean;
  name: string;
  placeholder?: string;
}
