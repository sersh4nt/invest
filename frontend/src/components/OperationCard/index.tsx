import {
  Avatar,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  Flex,
} from "@mantine/core";
import { memo, useState } from "react";
import { withCurrency } from "../../utils/strings";

interface OperationCardProps {
  topText: string;
  bottomText: string;
  payment: number;
  currency: string;
  date: Date | string;
  affix?: JSX.Element;
  avatarSrc?: string;
}

const OperationCard: React.FC<OperationCardProps> = ({
  topText,
  bottomText,
  payment,
  date,
  affix,
  avatarSrc = null,
  currency,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleExpand = () => setIsExpanded((p) => !p);

  return (
    <Paper
      radius="sm"
      p={8}
      style={{
        background: "rgb(73, 80, 87)",
        cursor: affix && "pointer",
        color: "#fff",
      }}
      onClick={affix && handleExpand}
    >
      <Flex fz="sm" wrap="nowrap" gap={6}>
        <Avatar radius="xl" size={40} src={avatarSrc} />
        <Stack
          spacing={0}
          style={{ flex: "1 0 0", width: "calc(100% - 46px)" }}
        >
          <Flex justify="space-between" direction="row-reverse" w="100%">
            <Text color={payment > 0 ? "teal" : "inherit"}>
              {withCurrency(payment, currency)}
            </Text>
            <Text truncate fw={500}>
              {topText}
            </Text>
          </Flex>
          <Group position="apart">
            <Text truncate w="auto">
              {bottomText}
            </Text>
            <Text>
              {new Date(date).toLocaleTimeString("ru-RU", {
                timeStyle: "short",
              })}
            </Text>
          </Group>
        </Stack>
      </Flex>
      <Collapse in={isExpanded} mt={4}>
        {affix && affix}
      </Collapse>
    </Paper>
  );
};

export default memo(OperationCard);
