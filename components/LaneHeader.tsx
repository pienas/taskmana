import { Button, Grid, Group, Text } from "@mantine/core";
import { DotsVertical, Plus } from "tabler-icons-react";

const LaneHeader = ({ title }) => {
  return (
    <Grid
      style={{ cursor: "grab", width: 300, marginLeft: 5 }}
      align="center"
      justify="space-between"
    >
      <Text weight={600}>{title}</Text>
      <Group spacing="xs">
        <Button
          variant="subtle"
          color="dark"
          size="lg"
          compact
          radius="md"
          p={0}
          styles={(theme) => ({
            root: {
              transition: "all .2s",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
              },
            },
          })}
        >
          <Plus />
        </Button>
        <Button
          variant="subtle"
          color="dark"
          size="lg"
          compact
          radius="md"
          p={0}
          styles={(theme) => ({
            root: {
              transition: "all .2s",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
              },
            },
          })}
        >
          <DotsVertical />
        </Button>
      </Group>
    </Grid>
  );
};

export default LaneHeader;
