import { Card, Paper } from "@mantine/core";
import { ActiveOrderScheme } from "../../models";
import { memo } from "react";

interface OrderCardProps {
  data: ActiveOrderScheme;
}

const OrderCard: React.FC<OrderCardProps> = ({ data }) => {
  return (
    <Paper radius="sm" p="xs" style={{ background: "rgb(73, 80, 87)" }}>
      sdfasfasdf
    </Paper>
  );
};

export default memo(OrderCard);
