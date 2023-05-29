import { Container, SimpleGrid } from "@mantine/core";
import OrdersList from "./OrdersList";
import OperationsList from "./OperationsList";
import useSubaccount from "../../hooks/useSubaccount";
import NoSubaccount from "../../components/NoSubaccount";

const Orders: React.FC = () => {
  const { subaccount } = useSubaccount();

  if (!subaccount) {
    return <NoSubaccount />;
  }

  return (
    <Container size="sm" style={{ height: "100%" }} p={0}>
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
