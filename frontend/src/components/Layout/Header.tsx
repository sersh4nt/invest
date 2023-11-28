import {
  Burger,
  Group,
  Header as MantineHeader,
  MediaQuery,
  Text,
  useMantineTheme,
  Image,
  Anchor,
  Grid,
} from "@mantine/core";
import AccountSelector from "./AccountSelector";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  opened: boolean;
  setOpened: (fn: any) => void;
}

const Header: React.FC<HeaderProps> = ({ opened, setOpened }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

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
        <Grid align="center" justify="space-between" w="100%">
          <Grid.Col span="auto">
            <Group align="end">
              <Image
                src={logo}
                width={90}
                fit="contain"
                onClick={() => navigate("/")}
                sx={{ cursor: "pointer" }}
              />
              <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                <Text c="dimmed" fz="xs">
                  {" "}
                  by{" "}
                  <Anchor
                    c="blue"
                    inherit
                    href="https://t.me/sersh4nt"
                    target="_blank"
                  >
                    @sersh4nt
                  </Anchor>
                </Text>
              </MediaQuery>
            </Group>
          </Grid.Col>
          <Grid.Col span="content">
            <AccountSelector />
          </Grid.Col>
        </Grid>
      </div>
    </MantineHeader>
  );
};

export default Header;
