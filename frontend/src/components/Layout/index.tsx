import { AppShell, LoadingOverlay, useMantineTheme } from "@mantine/core";
import { Suspense, useState } from "react";
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
      navbar={<Navbar opened={opened} setOpened={setOpened} />}
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      <Suspense
        fallback={
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <LoadingOverlay visible />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </AppShell>
  );
};

export default Layout;
