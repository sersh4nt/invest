import { Center, Stack, Text } from "@mantine/core";

const NoSubaccount: React.FC = () => {
  return (
    <Center sx={{ height: "100%" }}>
      <Stack>
        <Text>Счет не выбран!</Text>
        <Text>Пожалуйста, выберете счет в меню сверху</Text>
      </Stack>
    </Center>
  );
};

export default NoSubaccount;
