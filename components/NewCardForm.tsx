import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useState } from "react";
import { ExclamationMark } from "tabler-icons-react";

const NewCardForm = ({ onCancel, onAdd }) => {
  const notifications = useNotifications();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const handleAdd = () => {
    if (!taskTitle.length)
      return notifications.showNotification({
        title: "No name",
        message: "Please enter a task name",
        color: "red",
        icon: <ExclamationMark />,
      });
    if (!taskDescription.length)
      return notifications.showNotification({
        title: "No description",
        message: "Please enter a task description",
        color: "red",
        icon: <ExclamationMark />,
      });
    onAdd({ title: taskTitle, description: taskDescription });
    setTaskTitle("");
    setTaskDescription("");
  };
  return (
    <>
      <TextInput
        placeholder="Enter a task name"
        radius="md"
        size="md"
        variant="default"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.currentTarget.value)}
        required
        mb={8}
      />
      <Textarea
        placeholder="Add a description"
        radius="md"
        size="md"
        variant="default"
        value={taskDescription}
        required
        onChange={(e) => setTaskDescription(e.currentTarget.value)}
      />
      <Group position="right" mt="md">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="light" onClick={handleAdd}>
          Add
        </Button>
      </Group>
    </>
  );
};

export default NewCardForm;
