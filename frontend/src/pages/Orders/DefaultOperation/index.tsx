import OperationCard from "../../../components/OperationCard";
import { OperationProps } from "../OperationFactory";
import InputImage from "./InputImage";
import OutputImage from "./OutputImage";
import TaxImage from "./TaxImage";

const textMap = new Map(
  Object.entries({
    DIVIDEND: {
      topText: "Выплата дивидендов",
      avatarSrc: <InputImage color="#3cb372" />,
    },
    DIVIDEND_TAX: {
      topText: "Удержание налога по дивидендам",
      avatarSrc: <TaxImage color="#106da3" />,
    },
    TAX: {
      topText: "Удержание налога",
      avatarSrc: <TaxImage color="#106da3" />,
    },
    INPUT: {
      topText: "Пополнение счета",
      avatarSrc: <InputImage color="#3cb372" />,
    },
    OUTPUT: {
      topText: "Вывод со счета",
      avatarSrc: <OutputImage color="rose" />,
    },
    TAX_CORRECTION: {
      topText: "Корректировка налога",
      avatarSrc: <TaxImage color="#106da3" />,
    },
  })
);

const DefaultOperation: React.FC<OperationProps> = ({ operation }) => {
  const props = textMap.get(operation.type);
  return (
    props && (
      <OperationCard {...operation} {...props} bottomText="Брокерский счет" />
    )
  );
};

export default DefaultOperation;
