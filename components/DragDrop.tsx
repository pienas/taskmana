import React, { useState } from "react";
import {
  Button,
  Center,
  Drawer,
  Loader,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Check, ExclamationMark } from "tabler-icons-react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {
  createColumn,
  createTask,
  deleteTask,
  moveColumn,
  moveTask,
  updateTask,
} from "@lib/db";
import Board from "react-trello";
import NewLaneForm from "./NewLaneForm";
import NewCardForm from "./NewCardForm";
import AddCardLink from "./AddCardLink";
import Card from "./Card";
import LaneHeader from "./LaneHeader";
import NewLaneSection from "./NewLaneSection";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Column, Task } from "@utils/types";
import { useAuth } from "./AuthProvider";

const DragDrop = ({ projectId }) => {
  const theme = useMantineTheme();
  const notifications = useNotifications();
  const { token, uid } = useAuth();
  const { data, error, mutate } = useSWR(
    uid ? [`/api/${projectId}/columns`, token] : null,
    fetcher
  );
  const [opened, setOpened] = useState(false);
  const [taskState, setTaskState] = useState<Task>({
    id: "",
    title: "",
    description: "",
    dueDate: undefined,
    dueTime: undefined,
  });
  const [columnId, setColumnId] = useState("");
  if (error)
    return (
      <>
        Failed to load
        <div>{error}</div>
      </>
    );
  if (!data)
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader size="xl" variant="bars" />
      </Center>
    );
  if (data.error) return <Text pl={300}>{data.error}</Text>;
  const boardData = {
    lanes: data.sort((a: Column, b: Column) => a.position - b.position),
  };
  const onNewCard = async (card: Task, laneId: string) => {
    await createTask(projectId, laneId, card);
    return notifications.showNotification({
      title: "Task added",
      message: "Your new task was succesfully added",
      color: "green",
      icon: <Check />,
    });
  };
  const updateTaskConfirm = async () => {
    if (!taskState.title.length)
      return notifications.showNotification({
        title: "No name",
        message: "Please enter a task name",
        color: "red",
        icon: <ExclamationMark />,
      });
    if (!taskState.description.length)
      return notifications.showNotification({
        title: "No description",
        message: "Please enter a task description",
        color: "red",
        icon: <ExclamationMark />,
      });
    await updateTask(projectId, columnId, taskState);
    mutate();
    setOpened(false);
    setTaskState({
      id: "",
      title: "",
      description: "",
      dueDate: undefined,
      dueTime: undefined,
    });
    setColumnId("");
    return notifications.showNotification({
      title: "Task updated",
      message: "Your task was succesfully updated",
      color: "green",
      icon: <Check />,
    });
  };
  const onDeleteCard = async (cardId: string, laneId: string) => {
    await deleteTask(projectId, laneId, cardId);
    return notifications.showNotification({
      title: "Task removed",
      message: "Your task was succesfully removed",
      color: "green",
      icon: <Check />,
    });
  };
  const onMoveCard = async (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => {
    await moveTask(projectId, fromColumnId, toColumnId, taskId);
  };
  const onNewColumn = async (column: Column) => {
    await createColumn(projectId, column);
    return notifications.showNotification({
      title: "Column added",
      message: "Your new column was succesfully added",
      color: "green",
      icon: <Check />,
    });
  };
  const onMoveColumn = async (from: number, to: number) => {
    await moveColumn(projectId, from, to);
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xl"
        size="40%"
        position="right"
      >
        <Stack justify="space-between" style={{ height: "95%" }}>
          <Stack>
            <TextInput
              placeholder="Enter a task name"
              radius="md"
              size="md"
              variant="default"
              value={taskState.title}
              label="Task name"
              required
              sx={() => ({
                input: {
                  fontSize: "1.3rem",
                  color: theme.white,
                  border: "1px solid #1a1b1e",
                  backgroundColor: theme.colors.dark[7],
                  "&:hover": { border: "1px solid #2c2e33" },
                },
                label: {
                  marginLeft: "0.9rem",
                  marginBottom: "0.5rem",
                  fontWeight: "400",
                  fontSize: "0.8rem",
                },
              })}
              onChange={(e) =>
                setTaskState({ ...taskState, title: e.currentTarget.value })
              }
            />
            <Textarea
              placeholder="Enter a task description"
              radius="md"
              size="md"
              variant="default"
              value={taskState.description}
              autosize
              label="Description"
              required
              sx={() => ({
                textarea: {
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  lineHeight: "1.4rem",
                  color: theme.white,
                  border: "1px solid #1a1b1e",
                  backgroundColor: theme.colors.dark[7],
                  "&:hover": { border: "1px solid #2c2e33" },
                },
                label: {
                  marginLeft: "0.9rem",
                  marginBottom: "0.5rem",
                  fontWeight: "400",
                  fontSize: "0.8rem",
                },
              })}
              onChange={(e) =>
                setTaskState({
                  ...taskState,
                  description: e.currentTarget.value,
                })
              }
            />
            <DatePicker
              allowFreeInput
              radius="md"
              size="md"
              variant="default"
              label="Due date"
              placeholder="Pick due date"
              inputFormat="YYYY-MM-DD"
              labelFormat="MMMM, YYYY"
              value={
                taskState.dueDate ? new Date(taskState.dueDate) : undefined
              }
              sx={() => ({
                input: {
                  fontSize: "1rem",
                  color: theme.white,
                  border: "1px solid #1a1b1e",
                  backgroundColor: theme.colors.dark[7],
                  "&:hover": { border: "1px solid #2c2e33" },
                },
                label: {
                  marginLeft: "0.9rem",
                  marginBottom: "0.5rem",
                  fontWeight: "400",
                  fontSize: "0.8rem",
                },
              })}
              onChange={(e) =>
                setTaskState({ ...taskState, dueDate: e?.getTime() })
              }
              clearable={false}
              mb={8}
            />
            <TimeInput
              variant="default"
              radius="md"
              size="md"
              label="Due time"
              value={
                taskState.dueTime ? new Date(taskState.dueTime) : undefined
              }
              sx={() => ({
                ".mantine-TimeInput-input": {
                  fontSize: "1rem",
                  color: theme.white,
                  border: "1px solid #1a1b1e",
                  backgroundColor: theme.colors.dark[7],
                  "&:hover": { border: "1px solid #2c2e33" },
                },
                label: {
                  marginLeft: "0.9rem",
                  marginBottom: "0.5rem",
                  fontWeight: "400",
                  fontSize: "0.8rem",
                },
              })}
              onChange={(e) =>
                setTaskState({ ...taskState, dueTime: e.getTime() })
              }
            />
          </Stack>
          <Button variant="light" onClick={updateTaskConfirm}>
            Save
          </Button>
        </Stack>
      </Drawer>
      <Board
        data={boardData}
        draggable
        editable
        canAddLanes
        style={{
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
          height: "96.5vh",
          marginLeft: "300px",
        }}
        laneStyle={{
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        }}
        components={{
          AddCardLink: AddCardLink,
          Card: Card,
          LaneHeader: LaneHeader,
          NewCardForm: NewCardForm,
          NewLaneForm: NewLaneForm,
          NewLaneSection: NewLaneSection,
        }}
        onCardAdd={onNewCard}
        onCardClick={(taskId, _, columnId) => {
          const column = data.find((column: Column) => column.id === columnId);
          if (column) {
            const cards = column.cards;
            if (cards) {
              const task = cards.find((card) => card.id === taskId);
              if (task) {
                setTaskState({
                  id: taskId,
                  title: task.title,
                  description: task?.description,
                  dueDate: task.dueDate,
                  dueTime: task.dueTime,
                });
              }
            }
          }
          setColumnId(columnId);
          setOpened(true);
        }}
        onCardDelete={onDeleteCard}
        onLaneAdd={onNewColumn}
        onCardMoveAcrossLanes={onMoveCard}
        handleLaneDragEnd={onMoveColumn}
      />
    </>
  );
};

export default DragDrop;
