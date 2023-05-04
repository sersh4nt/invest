import { AppShell, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<Navbar opened={opened} />}
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      <Outlet />
    </AppShell>
  );
};

export default Layout;
