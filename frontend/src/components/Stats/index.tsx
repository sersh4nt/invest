import { Group, Paper, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface StatsProps {
  title: string;
  value: JSX.Element | string;
  icon?: JSX.Element;
  addContent?: JSX.Element;
}

const Stats: React.FC<StatsProps> = ({
  title,
  value,
  icon = null,
  addContent = null,
}) => {
  const { classes } = useStyles();

  return (
    <Paper withBorder p="md" radius="md" key={title}>
      <Group position="apart">
        <div>
          <Text
            c="dimmed"
            tt="uppercase"
            fw={700}
            fz="xs"
            className={classes.label}
          >
            {title}
          </Text>
          <Text fw={700} fz="xl">
            {value}
          </Text>
        </div>
        {icon}
      </Group>

      {addContent}
      {/* <Text c="dimmed" fz="sm" mt="md">
        <Text component="span" c={diff > 0 ? "teal" : "red"} fw={700}>
          {diff}%
        </Text>{" "}
        {diff > 0 ? "increase" : "decrease"} compared to last month
      </Text> */}
    </Paper>
  );
};

export default Stats;
