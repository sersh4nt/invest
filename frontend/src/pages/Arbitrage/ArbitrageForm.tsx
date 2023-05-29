import {
  Avatar,
  Box,
  CloseButton,
  Flex,
  Group,
  MultiSelect,
  MultiSelectValueProps,
  NumberInput,
  SelectItem,
  rem,
} from "@mantine/core";
import { Control, Controller } from "react-hook-form";
import { forwardRef } from "react";

import BNB from "../../assets/BNB.png";
import BTC from "../../assets/BTC.png";
import BUSD from "../../assets/BUSD.png";
import ETH from "../../assets/ETH.png";
import USDT from "../../assets/USDT.png";
import RUB from "../../assets/RUB.png";

interface ImagedSelectItem extends SelectItem {
  image?: string;
}

interface ArbitrageFormProps {
  control: Control<any>;
}

const symbols = [
  { label: "USDT", value: "USDT", image: USDT },
  { label: "BTC", value: "BTC", image: BTC },
  { label: "BUSD", value: "BUSD", image: BUSD },
  { label: "BNB", value: "BNB", image: BNB },
  { label: "ETH", value: "ETH", image: ETH },
  { label: "RUB", value: "RUB", image: RUB },
] as ImagedSelectItem[];

const paymentMethods = [
  { label: "Sberbank", value: "RosBankNew" },
  { label: "Tinkoff", value: "TinkoffNew" },
  { label: "QIWI", value: "QIWI" },
  { label: "ЮMoney", value: "YandexMoneyNew" },
  { label: "МТС Банк", value: "MTSBank" },
  { label: "Почта Банк", value: "PostBankNew" },
  { label: "Home Credit Bank", value: "HomeCreditBank" },
  { label: "Пополнение счета мобильного", value: "Mobiletopup" },
  { label: "АкБарс Банк", value: "AkBarsBank" },
  { label: "Уралсиб", value: "UralsibBank" },
  { label: "Ренессанс кредит", value: "RenaissanceCredit" },
] as ImagedSelectItem[];

const Item = forwardRef<HTMLDivElement, ImagedSelectItem>(
  ({ label, value, image, ...others }, ref) => {
    return (
      <div ref={ref} {...others}>
        <Flex align="center">
          <Box mr={10}>
            <Avatar src={image} size="sm" />
          </Box>
          <div>{label}</div>
        </Flex>
      </div>
    );
  }
);

function Value({
  value,
  label,
  image,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & { value: string; image?: string }) {
  return (
    <div {...others}>
      <Box
        sx={(theme) => ({
          display: "flex",
          cursor: "default",
          alignItems: "center",
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          border: `${rem(1)} solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[4]
          }`,
          paddingLeft: theme.spacing.xs,
          borderRadius: theme.radius.sm,
        })}
      >
        <Box mr={10}>
          <Avatar src={image} size="xs" />
        </Box>
        <Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Box>
    </div>
  );
}
const ArbitrageForm: React.FC<ArbitrageFormProps> = ({ control }) => {
  return (
    <Group>
      <Controller
        name="deals"
        control={control}
        render={({ field }) => <NumberInput {...field} label="Deals qty" />}
      />
      <Controller
        name="initialAmount"
        control={control}
        render={({ field }) => (
          <NumberInput {...field} label="Initial amount" />
        )}
      />
      <Controller
        name="symbols"
        control={control}
        render={({ field }) => (
          <MultiSelect
            {...field}
            data={symbols}
            label="Symbols"
            itemComponent={Item}
            valueComponent={Value}
          />
        )}
      />
      <Controller
        name="paymentMethods"
        control={control}
        render={({ field }) => (
          <MultiSelect
            {...field}
            data={paymentMethods}
            label="Payment methods"
            itemComponent={Item}
            valueComponent={Value}
          />
        )}
      />
      <Controller
        name="refetchInterval"
        control={control}
        render={({ field }) => (
          <NumberInput {...field} label="Refetch every, ms" />
        )}
      />
    </Group>
  );
};

export default ArbitrageForm;
