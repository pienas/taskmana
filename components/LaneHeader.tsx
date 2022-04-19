import { deleteColumn, updateColumnTitle } from "@lib/db";
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Menu,
  Modal,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { Check, Pencil, Trash, X } from "tabler-icons-react";

const LaneHeader = ({ project, id, title, onDelete }) => {
  const notifications = useNotifications();
  const [updatingTitle, setUpdatingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);
  const [tempTitle, setTempTitle] = useState("");
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const theme = useMantineTheme();
  const deleteLane = async () => {
    await deleteColumn(project, id);
    onDelete();
    setTempTitle("");
    return notifications.showNotification({
      title: "Column deleted",
      message: "Your column was succesfully deleted",
      color: "green",
      icon: <Check />,
    });
  };
  const saveTitle = async () => {
    await updateColumnTitle(project, id, columnTitle);
    setUpdatingTitle(false);
    return notifications.showNotification({
      title: "Title updated",
      message: "Your column title was succesfully updated",
      color: "green",
      icon: <Check />,
    });
  };
  const cancel = () => {
    setUpdatingTitle(false);
  };
  const closeModal = () => {
    setOpened(false);
    setTempTitle("");
  };
  return (
    <>
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
                  width: "220px",
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
            <ActionIcon
              variant="light"
              color="blue"
              size="sm"
              onClick={saveTitle}
              mr={4}
            >
              <Check size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="blue" size="sm" onClick={cancel}>
              <X size={16} />
            </ActionIcon>
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
          <Menu.Item
            color="red"
            icon={<Trash size={14} />}
            onClick={() => setOpened(true)}
          >
            Delete column
          </Menu.Item>
        </Menu>
      </Grid>
      <Modal
        opened={opened}
        onClose={closeModal}
        withCloseButton={false}
        centered
        size="lg"
        sx={{
          ".mantine-Modal-modal": {
            backgroundColor: theme.colors.red[3],
            padding: 0,
          },
        }}
      >
        <Text
          size="xl"
          weight={600}
          color={theme.colors.red[8]}
          mb={8}
          p={20}
          pb={0}
        >
          Delete this column?
        </Text>
        <Text size="sm" weight={500} color={theme.colors.red[8]} p={20} pt={0}>
          Doing so will permanently delete the data at this column, including
          all nested tasks, subtasks and comments.
        </Text>
        <Box sx={{ backgroundColor: theme.colors.dark, padding: 20 }}>
          <Text color="dimmed" size="sm">
            Column title:
          </Text>
          <Text color="white" weight={600} mb={8}>
            {columnTitle}
          </Text>
          <Text color="dimmed" size="sm" mb={8}>
            Confirm you want to delete this column by typing its title below:
          </Text>
          <TextInput
            placeholder={columnTitle}
            radius="md"
            size="md"
            variant="default"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.currentTarget.value)}
            required
            mb={8}
          />
          <Group position="right" mt="md">
            <Button variant="subtle" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              color="red"
              variant="light"
              disabled={columnTitle !== tempTitle}
              onClick={deleteLane}
              sx={{ transition: "all .4s" }}
            >
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
};

export default LaneHeader;
