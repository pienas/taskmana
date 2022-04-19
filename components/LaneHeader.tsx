import { deleteColumn, updateColumnTitle } from "@lib/db";
import { Button, Grid, Menu, Text, TextInput } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { Check, Pencil, Trash } from "tabler-icons-react";

const LaneHeader = ({ id, title, onDelete }) => {
  const notifications = useNotifications();
  const [updatingTitle, setUpdatingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);
  const ref = useRef<HTMLInputElement>(null);
  const deleteLane = async () => {
    await deleteColumn(id);
    onDelete();
    return notifications.showNotification({
      title: "Column deleted",
      message: "Your column was succesfully deleted",
      color: "green",
      icon: <Check />,
    });
  };
  const saveTitle = async () => {
    await updateColumnTitle(id, columnTitle);
    setUpdatingTitle(false);
    return notifications.showNotification({
      title: "Title updated",
      message: "Your column title was succesfully updated",
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
      {updatingTitle ? (
        <>
          <TextInput
            placeholder="Enter a column title"
            variant="default"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.currentTarget.value)}
            required
            ref={ref}
            sx={{
              input: {
                border: "none",
                width: "240px",
                height: "25px",
                minHeight: "25px",
                fontWeight: 600,
                color: "white",
                fontSize: "16px",
                padding: 0,
                backgroundColor: "transparent",
              },
            }}
          />
          <Button
            variant="light"
            radius="xs"
            p={3}
            style={{ width: 24, height: 24 }}
            onClick={saveTitle}
          >
            <Check />
          </Button>
        </>
      ) : (
        <Text weight={600}>{columnTitle}</Text>
      )}
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
        <Menu.Item
          icon={<Pencil size={14} />}
          onClick={() => {
            setUpdatingTitle(true);
            setTimeout(() => {
              ref.current?.focus();
            }, 200);
          }}
        >
          Edit column title
        </Menu.Item>
        <Menu.Item color="red" icon={<Trash size={14} />} onClick={deleteLane}>
          Delete column
        </Menu.Item>
      </Menu>
    </Grid>
  );
};

export default LaneHeader;
