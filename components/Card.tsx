import { Button, Group, Text, useMantineTheme } from "@mantine/core";
import { Trash } from "tabler-icons-react";

const Card = ({ title, description, onDelete }) => {
  const theme = useMantineTheme();
  const clickDelete = (e) => {
    onDelete();
    e.stopPropagation();
  };
  return (
    <div
      style={{
        ...theme.fn.focusStyles(),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        border: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[2]
        }`,
        padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
        marginBottom: theme.spacing.sm,
        height: "100px",
        width: "300px",
        cursor: "grab",
      }}
    >
      <Group position="apart">
        <Text color={theme.colorScheme === "dark" ? theme.white : theme.black}>
          {title}
        </Text>
        <Button
          variant="subtle"
          color="dark"
          size="lg"
          compact
          radius="md"
          p={0}
          onClick={clickDelete}
          styles={(theme) => ({
            root: {
              transition: "all .2s",
              height: "24px",
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.white,
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
              },
            },
          })}
        >
          <Trash size={16} />
        </Button>
      </Group>
      <Text
        color="dimmed"
        size="sm"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </Text>
    </div>
  );
};

export default Card;
