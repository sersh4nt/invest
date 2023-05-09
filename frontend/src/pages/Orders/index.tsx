import { Container, SimpleGrid } from "@mantine/core";
import OrdersList from "./OrdersList";
import OperationsList from "./OperationsList";

const Orders: React.FC = () => {
  return (
    <Container size="sm" style={{ height: "100%" }}>
      <SimpleGrid
        cols={2}
        style={{ height: "100%" }}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      >
        <OrdersList />
        <OperationsList />
      </SimpleGrid>
    </Container>
  );
};
export default Orders;
