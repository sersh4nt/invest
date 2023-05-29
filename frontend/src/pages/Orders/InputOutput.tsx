import { capitalize } from "lodash";
import OperationCard from "../../components/OperationCard";
import { OperationProps } from "./OperationFactory";

const textMap = new Map(
  Object.entries({
    DIVIDEND: "Выплата дивидендов",
    DIVIDEND_TAX: "Удержание налога по дивидендам",
    TAX: "Выплата дивидендов",
    INPUT: "Пополнение счета",
    OUTPUT: "Вывод со счета",
    TAX_CORRECTION: "Корректировка налога",
  })
);

const DefaultOperation: React.FC<OperationProps> = ({ operation }) => {
  const topText = capitalize(textMap.get(operation.type));
  return (
    <OperationCard
      {...operation}
      topText={topText}
      bottomText="Брокерский счет"
    />
  );
};

export default DefaultOperation;
