import { Avatar, Group, Paper, Text } from "@mantine/core";
import { MRT_ColumnDef, MRT_Row, MantineReactTable } from "mantine-react-table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet } from "../../api/portfolio/portfolio";
import { PortfolioPositionScheme } from "../../models";
import { activeSubaccountSelector } from "../../store/subaccountSlice";
import { withCurrency } from "../../utils/strings";

const columns = [
  {
    header: "Name",
    accessorFn: (row: PortfolioPositionScheme) => (
      <Group spacing="sm">
        <Avatar radius="xl" size="sm" src={row.instrument.image_link} />
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
    id: "current_price",
    accessorFn: (row: PortfolioPositionScheme) =>
      withCurrency(row.current_price, row.instrument.currency),
    maxSize: 50,
  },
  {
    header: "Average",
    id: "average_price",
    accessorFn: (row: PortfolioPositionScheme) =>
      withCurrency(row.average_price, row.instrument.currency),
    maxSize: 50,
  },
  {
    header: "Cost",
    accessorFn: (row: PortfolioPositionScheme) =>
      withCurrency(
        Math.round(
          row.current_price * row.quantity * row.instrument.lot * 100
        ) / 100,
        row.instrument.currency
      ),
    id: "cost",
    maxSize: 50,
  },
  {
    header: "Yield",
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
