import {
  Navbar as MantiveNavbar,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mainRoutes } from "../../data/routes";
import useAuth from "../../hooks/useAuth";

interface NavbarProps {
  opened: boolean;
  setOpened: (v: boolean) => void;
}

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },
  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const Navbar: React.FC<NavbarProps> = ({ opened, setOpened }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();

  const { classes, cx } = useStyles();

  const [active, setActive] = useState<string>("");

  useEffect(() => setActive(location.pathname), [location]);

  const links = mainRoutes.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.path === active,
      })}
      href={item.path}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.path);
        setOpened(false);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  const handleLogout = () => logout();

  return (
    <MantiveNavbar
      p="md"
      hidden={!opened}
      hiddenBreakpoint="sm"
      width={{ sm: 200, lg: 300 }}
    >
      <MantiveNavbar.Section grow>{links}</MantiveNavbar.Section>
      <MantiveNavbar.Section>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </MantiveNavbar.Section>
    </MantiveNavbar>
  );
};

export default Navbar;
