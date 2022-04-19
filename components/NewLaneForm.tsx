import { Box, Button, Group, TextInput } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useState } from "react";
import { ExclamationMark } from "tabler-icons-react";
import { v4 as uuid } from "uuid";

const NewLaneForm = ({ onCancel, onAdd }) => {
  const notifications = useNotifications();
  const [columnTitle, setColumnTitle] = useState("");
  const handleAdd = () => {
    if (!columnTitle.length)
      return notifications.showNotification({
        title: "No name",
        message: "Please enter a task name",
        color: "red",
        icon: <ExclamationMark />,
      });
    const columnCount =
      document.getElementsByClassName("react-trello-lane").length;
    onAdd({ id: uuid(), title: columnTitle, position: columnCount });
    setColumnTitle("");
  };
  return (
    <Box style={{ width: 300 }}>
      <TextInput
        placeholder="Enter a column title"
        radius="md"
        size="md"
        variant="default"
        value={columnTitle}
        onChange={(e) => setColumnTitle(e.currentTarget.value)}
        required
        mb={8}
      />
      <Group position="right" mt="md">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="light" onClick={handleAdd}>
          Add
        </Button>
      </Group>
    </Box>
  );
};

export default NewLaneForm;
