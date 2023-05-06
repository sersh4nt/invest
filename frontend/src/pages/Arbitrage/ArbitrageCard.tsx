import { Avatar, Group, Text, Card, Stack } from "@mantine/core";
import { ArbitrageResult } from "../../models";
import { IconArrowBigRight } from "@tabler/icons-react";

import BNB from "../../assets/BNB.png";
import BTC from "../../assets/BTC.png";
import BUSD from "../../assets/BUSD.png";
import ETH from "../../assets/ETH.png";
import USDT from "../../assets/USDT.png";
import RUB from "../../assets/RUB.png";
import React from "react";

const images = { BNB, BTC, BUSD, ETH, USDT, RUB };

interface ArbitrageCardProps {
  result: ArbitrageResult;
  key: number;
}

const ArbitrageCard: React.FC<ArbitrageCardProps> = ({ result }) => {
  return (
    <Card variant="contained">
      <Stack>
        <Group position="apart">
          <Group>
            <Avatar
              src={images[result.symbols[0] as keyof typeof images]}
              size={16}
            />
            {result.symbols.slice(1).map((item, key) => (
              <React.Fragment key={key}>
                <IconArrowBigRight size={16} />
                <Avatar src={images[item as keyof typeof images]} size={16} />
              </React.Fragment>
            ))}
          </Group>
          <Text color={result.revenue_relative > 0 ? "teal" : "red"}>
            {(result.revenue_relative * 100).toFixed(2)}%
          </Text>
        </Group>
        <Group>
          <Text>{result.payment_method_from}</Text>
          <IconArrowBigRight size={16} />
          <Text>{result.payment_method_to}</Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default ArbitrageCard;
