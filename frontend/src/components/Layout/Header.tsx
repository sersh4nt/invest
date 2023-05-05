import {
  Burger,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core";
import AccountSelector from "./AccountSelector";

interface HeaderProps {
  opened: boolean;
  setOpened: (fn: any) => void;
}

const Header: React.FC<HeaderProps> = ({ opened, setOpened }) => {
  const theme = useMantineTheme();

  return (
    <MantineHeader height={56} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o: boolean) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group position="apart" sx={{width: '100%'}}>
          <Text>Invest</Text>
          <AccountSelector />
        </Group>
      </div>
    </MantineHeader>
  );
};

export default Header;
