import { ActionIcon, Avatar, Box, Group, Tooltip } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useListInstrumentMetricsApiV1InstrumentsMetricsGet } from "../../api/instruments/instruments";
import { InstrumentMetricsScheme } from "../../models";
import { asRuNumber, withCurrency } from "../../utils/strings";

const columns = [
  {
    accessorFn: (row: InstrumentMetricsScheme) => (
      <Group spacing="xs">
        <Avatar src={row.instrument?.image_link} radius="xl" size={24} />
        {row.instrument?.name}
      </Group>
    ),
    header: "Инструмент",
    id: "instr",
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      asRuNumber(row.volatility / 1000),
    header: "Волатильность",
    id: "volatility",
    maxSize: 50,
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      asRuNumber(row.buy_volume + row.sell_volume),
    header: "Объем",
    id: "volume",
    maxSize: 50,
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      asRuNumber((row.volatility * (row.buy_volume + row.sell_volume)) / 1000),
    header: "Волатильность-объем",
    id: "vv",
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) => asRuNumber(row.spread),
    id: "spread",
    header: "Спред",
    maxSize: 50,
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      withCurrency(row.last_price * (row.instrument?.lot ?? 1), "rub"),
    id: "last_price",
    header: "Цена",
    maxSize: 50,
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      asRuNumber(row.relative_price),
    id: "relative_price",
    header: "Относительная цена",

  },
  {
    accessorFn: (row: InstrumentMetricsScheme) => asRuNumber(row.gain),
    id: "gain",
    header: "Прирост, %",
    maxSize: 50,
  },
] as MRT_ColumnDef[];

const ArbitrageTable: React.FC = () => {
  const { refetch, data, isLoading, isError, isFetching } =
    useListInstrumentMetricsApiV1InstrumentsMetricsGet();

  return (
    <MantineReactTable
      columns={columns}
      data={data?.items ?? []}
      state={{
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
      }}
      initialState={{
        density: "xs",
        pagination: { pageIndex: 0, pageSize: 15 },
        sorting: [{ id: "vv", desc: true }],
      }}
      mantineTableProps={{ striped: true }}
      mantineTableHeadCellProps={{ sx: { padding: 0 } }}
      renderTopToolbarCustomActions={() => {
        return (
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Tooltip withArrow position="right" label="Обновить данные">
              <ActionIcon onClick={() => refetch()}>
                <IconRefresh />
              </ActionIcon>
            </Tooltip>
          </Box>
        );
      }}
    />
  );
};

export default ArbitrageTable;
