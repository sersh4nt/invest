import { capitalize } from "lodash";
import OperationCard from "../../components/OperationCard";
import { OperationProps } from "./OperationFactory";

const InputOutput: React.FC<OperationProps> = ({ operation }) => {
  const topText = capitalize(operation.type);
  return (
    <OperationCard
      {...operation}
      topText={topText}
      bottomText="Broker account"
    />
  );
};

export default InputOutput;
