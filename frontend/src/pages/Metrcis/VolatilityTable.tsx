import { ActionIcon, Box, Tooltip } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { useEffect, useState } from "react";
import { useListInstrumentMetricsApiV1InstrumentsMetricsGet } from "../../api/instruments/instruments";
import { InstrumentMetricsScheme } from "../../models";
import { asRuNumber, withCurrency } from "../../utils/strings";

const columns = [
  {
    accessorFn: (row: InstrumentMetricsScheme) => row.instrument.name,
    header: "Инструмент",
    id: "instr",
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      asRuNumber(row.volatility / 1000),
    header: "Волатильность",
    id: "volatility",
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      asRuNumber(row.buy_volume + row.sell_volume),
    header: "Объем",
    id: "volume",
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
  },
  {
    accessorFn: (row: InstrumentMetricsScheme) =>
      withCurrency(row.last_price * row.instrument.lot, "rub"),
    id: "last_price",
    header: "Цена",
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
  },
] as MRT_ColumnDef[];

const VolatilityTable: React.FC = () => {
  const [params, setParams] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "vv", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  useEffect(
    () =>
      setParams(
        Object.assign(
          {},
          {
            page: pagination.pageIndex,
            page_size: pagination.pageSize,
          },
          sorting.length > 0 && {
            order_by: (sorting[0].desc ? "-" : "") + sorting[0].id,
          },
          globalFilter && { search: globalFilter },
          columnFilters &&
            columnFilters.reduce(
              (res, item) => ({ ...res, [item.id]: item.value }),
              {}
            )
        )
      ),
    [pagination, columnFilters, globalFilter, sorting]
  );

  const { refetch, data, isLoading, isError, isFetching } =
    useListInstrumentMetricsApiV1InstrumentsMetricsGet(params);

  return (
    <MantineReactTable
      columns={columns}
      data={data?.items ?? []}
      state={{
        isLoading,
        columnFilters,
        globalFilter,
        sorting,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
      }}
      initialState={{
        density: "xs",
      }}
      manualFiltering
      manualSorting
      manualPagination
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      mantineTableProps={{ striped: true }}
      mantineTableHeadCellProps={{ sx: { padding: 0 } }}
      pageCount={data?.count ? Math.ceil(data.count / pagination.pageSize) : 1}
      rowCount={data?.count ?? 0}
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

export default VolatilityTable;
