import { OperationScheme } from "../../models";
import BuySell from "./BuySell";
import Coupon from "./Coupon";
import DefaultOperation from "./DefaultOperation";
import ServiceFee from "./ServiceFee";
import Varmargin from "./Varmargin";

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
    case "ACCRUING_VARMARGIN":
    case "WRITING_OFF_VARMARGIN":
      return <Varmargin operation={operation} />;
    case "COUPON":
      return <Coupon operation={operation} />;
    case "SERVICE_FEE":
      return <ServiceFee operation={operation} />;
    default:
      return <div>Неизвестный тип операции: {operation.type}</div>;
  }
};

export default OperationFactory;
