import { Center, Text } from "@mantine/core";

const NoSubaccount: React.FC = () => {
  return (
    <Center sx={{ height: "100%" }}>
      <Text>
        No subaccount chosen! <br />
        Please choose subaccount in top-right corner
      </Text>
    </Center>
  );
};

export default NoSubaccount;
