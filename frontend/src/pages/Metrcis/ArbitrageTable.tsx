import { ActionIcon, Avatar, Box, Group, Tooltip, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { ArbitrageDeltasScheme } from "../../models";
import { asRuNumber } from "../../utils/strings";
import { useListArbitrageDeltasApiV1ArbitrageDeltasGet } from "../../api/arbitrage/arbitrage";

const columns = [
  {
    accessorFn: (row: ArbitrageDeltasScheme) => (
      <Group spacing="xs">
        <Avatar src={row.share?.image_link} radius="xl" size={24} />
        {row.future?.name ?? row.future_figi}
      </Group>
    ),
    header: "Инструмент",
    id: "instr",
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.d_take && row.d_return ? asRuNumber(row.d_take - row.d_return) : "-",
    header: "Дельта",
    id: "delta",
    maxSize: 50,
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.d_take != undefined ? asRuNumber(row.d_take) : "-",
    header: "Дельта входа",
    id: "d_take",
    maxSize: 50,
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.d_return != undefined ? asRuNumber(row.d_return) : "-",
    header: "Дельта выхода",
    id: "d_return",
    maxSize: 50,
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.d_take_calculated != undefined
        ? asRuNumber(row.d_take_calculated)
        : "-",
    header: "Дельта входа рассчитанная",
    id: "d_take_calculated",
    maxSize: 50,
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.d_return_calculated != undefined
        ? asRuNumber(row.d_return_calculated)
        : "-",
    header: "Дельта выхода рассчитанная",
    id: "d_return_calculated",
    maxSize: 50,
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.multiplier != undefined ? asRuNumber(row.multiplier) : "-",
    header: "Мультипликатор",
    id: "multiplier",
    maxSize: 50,
  },
  {
    accessorFn: (row: ArbitrageDeltasScheme) =>
      row.is_active ? (
        <Text color="teal">Активна</Text>
      ) : (
        <Text color="red">Неактивна</Text>
      ),
    header: "Активность",
    id: "active",
    maxSize: 50,
  },
] as MRT_ColumnDef[];

const ArbitrageTable: React.FC = () => {
  const { refetch, data, isLoading, isError, isFetching } =
    useListArbitrageDeltasApiV1ArbitrageDeltasGet();

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
        sorting: [{ id: "delta", desc: true }],
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
