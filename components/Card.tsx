import { checkTask } from "@lib/db";
import { Button, Checkbox, Grid, Text, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { Trash } from "tabler-icons-react";

const Card = ({
  project,
  id,
  title,
  description,
  laneId,
  completed,
  onClick,
  onDelete,
}) => {
  const theme = useMantineTheme();
  const clickDelete = (e) => {
    onDelete();
    e.stopPropagation();
  };
  const [checked, setChecked] = useState(completed);
  const handleCheck = async () => {
    await checkTask(project, laneId, id, !checked);
    setChecked(!checked);
  };
  return (
    <>
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
        <Grid align="center">
          <Grid.Col span={2}>
            <Checkbox
              checked={checked}
              onChange={handleCheck}
              size="md"
              mr="xl"
              styles={{ input: { cursor: "pointer" } }}
            />
          </Grid.Col>
          <Grid.Col span={8} onClick={onClick}>
            <div>
              <Text
                color={theme.colorScheme === "dark" ? theme.white : theme.black}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </Text>
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
          </Grid.Col>
          <Grid.Col span={2}>
            <Button
              variant="subtle"
              color="dark"
              size="lg"
              compact
              radius="md"
              p={0}
              onClick={clickDelete}
              styles={() => ({
                root: {
                  transition: "all .2s",
                  height: "24px",
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.white,
                    color:
                      theme.colorScheme === "dark" ? theme.white : theme.black,
                  },
                },
              })}
            >
              <Trash size={16} />
            </Button>
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};

export default Card;
