import { OperationScheme } from "../../models";
import BuySell from "./BuySell";
import DefaultOperation from "./InputOutput";

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
    case "TAX":
    case "TAX_CORRECTION":
    case "DIVIDEND_TAX":
    case "DIVIDEND":
      return <DefaultOperation operation={operation} />;
    default:
      return <div>Неизвестный тип операции: {operation.type}</div>;
  }
};

export default OperationFactory;
