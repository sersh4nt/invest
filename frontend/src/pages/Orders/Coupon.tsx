import OperationCard from "../../components/OperationCard";
import { OperationProps } from "./OperationFactory";

const Coupon: React.FC<OperationProps> = ({ operation }) => {
  const topText = `Начисление купона`;
  const bottomText = `Брокерский счет`;

  return (
    <OperationCard
      {...operation}
      topText={topText}
      bottomText={bottomText}
      avatarSrc={operation.instrument?.image_link}
    />
  );
};
export default Coupon;
