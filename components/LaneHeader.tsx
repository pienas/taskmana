import { deleteColumn, findColumnIdByName } from "@lib/db";
import { Grid, Menu, Text } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Check, Pencil, Trash } from "tabler-icons-react";

const LaneHeader = ({ title }) => {
  const notifications = useNotifications();
  const deleteLane = async () => {
    const columnId = await findColumnIdByName(title);
    await deleteColumn(columnId);
    return notifications.showNotification({
      title: "Column deleted",
      message: "Your column was succesfully deleted",
      color: "green",
      icon: <Check />,
    });
  };
  return (
    <Grid
      style={{ cursor: "grab", width: 300, marginLeft: 5 }}
      align="center"
      justify="space-between"
    >
      <Text weight={600}>{title}</Text>
      <Menu
        sx={(theme) => ({
          button: {
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
        <Menu.Item icon={<Pencil size={14} />}>Edit column title</Menu.Item>
        <Menu.Item color="red" icon={<Trash size={14} />} onClick={deleteLane}>
          Delete column
        </Menu.Item>
      </Menu>
    </Grid>
  );
};

export default LaneHeader;
