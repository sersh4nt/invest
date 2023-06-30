import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { MRT_ColumnDef, MRT_Row, MantineReactTable } from "mantine-react-table";
import { useEffect, useState } from "react";
import { useGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet } from "../../api/portfolio/portfolio";
import useSubaccount from "../../hooks/useSubaccount";
import { PortfolioPositionScheme } from "../../models";
import { withCurrency } from "../../utils/strings";

const columns = [
  {
    header: "Название",
    accessorFn: (row: PortfolioPositionScheme) => (
      <Group spacing="sm">
        <Avatar radius="xl" size="sm" src={row.instrument.image_link} />
        <Text>{row.instrument.name}</Text>
      </Group>
    ),
  },
  {
    header: "Количество",
    accessorKey: "quantity",
    maxSize: 50,
  },
  {
    header: "Цена",
    id: "current_price",
    accessorFn: (row: PortfolioPositionScheme) =>
      withCurrency(row.current_price, row.instrument.currency),
    maxSize: 50,
  },
  {
    header: "Средняя",
    id: "average_price",
    accessorFn: (row: PortfolioPositionScheme) =>
      withCurrency(row.average_price, row.instrument.currency),
    maxSize: 50,
  },
  {
    header: "Стоимость",
    accessorFn: (row: PortfolioPositionScheme) =>
      withCurrency(
        Math.round(
          row.current_price *
            row.quantity *
            (row.instrument.type != "currency" ? row.instrument.lot : 1) *
            100
        ) / 100,
        row.instrument.currency
      ),
    id: "cost",
    maxSize: 50,
  },
  {
    header: "Прибыль",
    accessorFn: (row: PortfolioPositionScheme) => {
      const value = row.expected_yield + row.current_nkd + row.var_margin;
      return (
        <Text color={value > 0 ? "teal" : value < 0 ? "red" : "default"}>
          {withCurrency(value, row.instrument.currency)}
        </Text>
      );
    },
    sortingFn: (
      rowA: MRT_Row<PortfolioPositionScheme>,
      rowB: MRT_Row<PortfolioPositionScheme>
    ) => {
      const valueA =
        rowA.original.expected_yield +
        rowA.original.current_nkd +
        rowA.original.var_margin;
      const valueB =
        rowB.original.expected_yield +
        rowB.original.current_nkd +
        rowA.original.var_margin;
      if (valueA == valueB) return 0;
      if (valueA > valueB) return 1;
      return -1;
    },
    id: "yield",
    maxSize: 50,
  },
] as MRT_ColumnDef[];

const PortfolioTable: React.FC = () => {
  const { subaccount } = useSubaccount();

  const [rows, setRows] = useState<PortfolioPositionScheme[]>([]);

  const { data, isFetching, refetch } =
    useGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet(
      Number(subaccount)
    );

  useEffect(() => {
    if (!data?.positions) {
      setRows([]);
      return;
    }
    setRows(data.positions);
  });

  return (
    <Paper>
      <MantineReactTable
        columns={columns}
        data={rows}
        state={{ isLoading: isFetching }}
        initialState={{ density: "xs", sorting: [{ id: "yield", desc: true }] }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Tooltip withArrow position="right" label="Обновить данные">
              <ActionIcon onClick={() => refetch()}>
                <IconRefresh />
              </ActionIcon>
            </Tooltip>
          </Box>
        )}
      />
    </Paper>
  );
};

export default PortfolioTable;
