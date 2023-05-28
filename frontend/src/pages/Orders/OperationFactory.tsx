import { OperationScheme } from "../../models";
import BuySell from "./BuySell";
import InputOutput from "./InputOutput";

export interface OperationProps {
  operation: OperationScheme;
}

const OperationFactory: React.FC<OperationProps> = ({ operation }) => {
  switch (operation.type) {
    case "BUY":
    case "SELL":
      return <BuySell operation={operation} />;
    case "INPUT":
    case "OUTPUT":
      return <InputOutput operation={operation} />;
    default:
      return <div>Неизвестный тип операции: {operation.type}</div>;
  }
};

export default OperationFactory;
