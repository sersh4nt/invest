import { Avatar, Group, Select, SelectItem, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { forwardRef, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useListInstrumentsApiV1InstrumentsGet } from "../../api/instruments/instruments";
import { FormInputProps } from "../../data/types";

interface InstrumentAutocompleteProps extends FormInputProps {}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image_link?: string;
  type: string;
  label: string;
  ticker: string;
}

const CustomSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image_link, type, label, ticker, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image_link} />
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.5}>
            {type} (ticker: {ticker})
          </Text>
        </div>
      </Group>
    </div>
  )
);

const InstrumentAutocomplete: React.FC<InstrumentAutocompleteProps> = ({
  control,
  name = "instrument",
  label,
  placeholder = 'Введите название или тикер',
  required,
}) => {
  const [value, setValue] = useState<string>("");
  const [q, setQ] = useState("");
  const [debouncedQ] = useDebouncedValue(q, 300);
  const { data } = useListInstrumentsApiV1InstrumentsGet(
    {
      q: debouncedQ,
    },
    { query: { enabled: debouncedQ != "" } }
  );

  const [options, setOptions] = useState<SelectItem[]>([]);

  useEffect(() => {
    if (q == "") {
      setOptions([]);
      return;
    }

    if (!data) {
      return;
    }

    setOptions(
      data.items.map((item) => ({
        image_link: item.image_link,
        type: item.type,
        value: item.figi,
        label: item.name,
        key: item.figi,
        ticker: item.ticker,
      }))
    );
  }, [data]);

  const handleSearch = (v: string) => {
    if (v != "") setQ(v);
  };

  const handleChange = (v: any, changeCallback: (v: string) => void) => {
    if (!v) return;
    console.log(v);
    setValue(v);
    changeCallback(v);
  };

  return (
    <Controller
      rules={{ required }}
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          value={value}
          onChange={(v) => handleChange(v, field.onChange)}
          itemComponent={CustomSelectItem}
          maxDropdownHeight={280}
          data={options}
          label={label}
          placeholder={placeholder}
          searchable
          onSearchChange={handleSearch}
          searchValue={q}
          nothingFound="Нет подящих инструментов!"
          clearable
          filter={() => true}
          withAsterisk={!!required}
          error={fieldState.error?.message}
        />
      )}
    />
  );
};

export default InstrumentAutocomplete;
