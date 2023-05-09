import { Avatar, Group, Paper, Text } from "@mantine/core";
import { MRT_ColumnDef, MRT_Row, MantineReactTable } from "mantine-react-table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet } from "../../api/portfolio/portfolio";
import { PortfolioPositionScheme } from "../../models";
import { activeSubaccountSelector } from "../../store/subaccountSlice";
import { currencyToSymbol } from "../../utils";

const columns = [
  {
    header: "Name",
    accessorFn: (row: PortfolioPositionScheme) => (
      <Group spacing="sm">
        <Avatar radius="xl" size="sm" />
        <Text>{row.instrument.name}</Text>
      </Group>
    ),
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    maxSize: 50,
  },
  {
    header: "Price",
    accessorKey: "current_price",
    maxSize: 50,
  },
  {
    header: "Average",
    accessorKey: "average_price",
    maxSize: 50,
  },
  {
    header: "Cost",
    accessorFn: (row: PortfolioPositionScheme) =>
      `${
        Math.round(
          row.current_price * row.quantity * row.instrument.lot * 100
        ) / 100
      } ${currencyToSymbol(row.instrument.currency)}`,
    id: "cost",
    maxSize: 50,
  },
  {
    header: "Yield",
    accessorFn: (row: PortfolioPositionScheme) => (
      <Text color={row.expected_yield > 0 ? "teal" : "red"}>
        {row.expected_yield}
      </Text>
    ),
    sortingFn: (
      rowA: MRT_Row<PortfolioPositionScheme>,
      rowB: MRT_Row<PortfolioPositionScheme>
    ) =>
      rowA.original.expected_yield > rowB.original.expected_yield
        ? 1
        : rowA.original.expected_yield == rowB.original.expected_yield
        ? 0
        : -1,
    id: "yield",
    maxSize: 50,
  },
] as MRT_ColumnDef[];

const PortfolioTable: React.FC = () => {
  const subaccount = useSelector(activeSubaccountSelector);

  const [rows, setRows] = useState<PortfolioPositionScheme[]>([]);

  const { data, isLoading } =
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
        state={{ isLoading }}
        initialState={{ density: "xs", sorting: [{ id: "yield", desc: true }] }}
      />
    </Paper>
  );
};

export default PortfolioTable;
