import OperationCard from "../../../components/OperationCard";
import { OperationProps } from "../OperationFactory";
import { Image } from "./Image";

const ServiceFee: React.FC<OperationProps> = ({ operation }) => {
  const topText = "Плата за обслуживание";
  const bottomText = `Брокерский счет`;

  return (
    <OperationCard
      {...operation}
      topText={topText}
      bottomText={bottomText}
      avatarSrc={<Image color="#106da3" />}
    />
  );
};
export default ServiceFee;
