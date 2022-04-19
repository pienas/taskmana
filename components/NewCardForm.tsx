import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useNotifications } from "@mantine/notifications";
import { useState } from "react";
import { ExclamationMark } from "tabler-icons-react";

const NewCardForm = ({ onCancel, onAdd }) => {
  const notifications = useNotifications();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState<Date | null>();
  const [taskTime, setTaskTime] = useState<Date>();
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
    onAdd({
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
    });
    setTaskTitle("");
    setTaskDescription("");
    setTaskDate(null);
    setTaskTime(undefined);
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
        onChange={(e) => setTaskDescription(e.currentTarget.value)}
        required
        mb={8}
      />
      <DatePicker
        allowFreeInput
        radius="md"
        size="md"
        variant="default"
        placeholder="Pick due date"
        inputFormat="YYYY-MM-DD"
        labelFormat="MMMM, YYYY"
        value={taskDate}
        onChange={(e) => setTaskDate(e)}
        clearable={false}
        mb={8}
      />
      <TimeInput
        variant="default"
        radius="md"
        size="md"
        value={taskTime}
        onChange={(e) => setTaskTime(e)}
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
