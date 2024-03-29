import { ActionIcon, Box, Group, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import Logo from "./Logo";

const Brand = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Group position="apart">
        <Logo colorScheme={colorScheme} />
        <ActionIcon
          variant="default"
          onClick={() => {
            toggleColorScheme();
            localStorage.setItem(
              "colorScheme",
              colorScheme === "light" ? "dark" : "light"
            );
          }}
          size={30}
        >
          {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default Brand;
