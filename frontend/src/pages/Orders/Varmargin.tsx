import OperationCard from "../../components/OperationCard";
import { OperationProps } from "./OperationFactory";
import InputImage from "./DefaultOperation/InputImage";
import OutputImage from "./DefaultOperation/OutputImage";

const Varmargin: React.FC<OperationProps> = ({ operation }) => {
  const topText = `${
    operation.type == "ACCRUING_VARMARGIN" ? "Начисление" : "Списание"
  } вармаржи`;
  const bottomText = `Брокерский счет`;

  return (
    <OperationCard
      {...operation}
      topText={topText}
      bottomText={bottomText}
      avatarSrc={
        operation.payment > 0 ? <InputImage color="#3cb372" /> : <OutputImage />
      }
    />
  );
};
export default Varmargin;
