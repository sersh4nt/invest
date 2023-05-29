import { useForm } from "react-hook-form";
import InstrumentAutocomplete from "../../components/InstrumentAutocomplete";

const BacktestFilters: React.FC = () => {
  const { control } = useForm();

  return (
    <InstrumentAutocomplete
      control={control}
      label="Filter by instrument"
      name="figi"
    />
  );
};

export default BacktestFilters;
