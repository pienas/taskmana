import React, { useState } from "react";
import {
  Button,
  Drawer,
  Stack,
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
  getTask,
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

type Task = {
  id: string;
  title: string;
  description: string;
  date: Date | null;
  time: Date;
};

type Column = {
  id: string;
  title: string;
  cards?: Array<Task>;
  position: number;
};

const DragDrop = () => {
  const theme = useMantineTheme();
  const notifications = useNotifications();
  const { data: originalColumns } = useSWR("/api/columns", fetcher);
  const [columns, setColumns] = useState<Column[]>([]);
  const [opened, setOpened] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [columnId, setColumnId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState<Date | null>();
  const [taskTime, setTaskTime] = useState<Date>();
  if (!originalColumns) return <>Loading...</>;
  if (!columns.length) {
    new Promise((resolve) => {
      resolve("Data passed");
    }).then(() => {
      setColumns(
        originalColumns.columns.sort(
          (a: Column, b: Column) => a.position - b.position
        )
      );
    });
  }
  const boardData = {
    lanes: columns,
  };
  const onNewCard = async (card: Task, laneId: string) => {
    await createTask(laneId, card);
    return notifications.showNotification({
      title: "Task added",
      message: "Your new task was succesfully added",
      color: "green",
      icon: <Check />,
    });
  };
  const updateTaskConfirm = async () => {
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
    await updateTask(columnId, {
      id: taskId,
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
    });
    setOpened(false);
    setTaskId("");
    setColumnId("");
    setTaskTitle("");
    setTaskDescription("");
    setTaskDate(null);
    setTaskTime(undefined);
    return notifications.showNotification({
      title: "Task updated",
      message: "Your task was succesfully updated",
      color: "green",
      icon: <Check />,
    });
  };
  const onDeleteCard = async (cardId: string, laneId: string) => {
    await deleteTask(laneId, cardId);
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
    await moveTask(fromColumnId, toColumnId, taskId);
  };
  const onNewColumn = async (column: Column) => {
    await createColumn(column);
    return notifications.showNotification({
      title: "Column added",
      message: "Your new column was succesfully added",
      color: "green",
      icon: <Check />,
    });
  };
  const onMoveColumn = async (from: number, to: number) => {
    await moveColumn(from, to);
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
              value={taskTitle}
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
              onChange={(e) => setTaskTitle(e.currentTarget.value)}
            />
            <Textarea
              placeholder="Enter a task description"
              radius="md"
              size="md"
              variant="default"
              value={taskDescription}
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
              onChange={(e) => setTaskDescription(e.currentTarget.value)}
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
              value={taskDate}
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
              onChange={(e) => setTaskDate(e)}
              clearable={false}
              mb={8}
            />
            <TimeInput
              variant="default"
              radius="md"
              size="md"
              label="Due time"
              value={taskTime}
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
              onChange={(e) => setTaskTime(e)}
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
        onCardClick={async (taskId, _, columnId) => {
          const { task } = await getTask(columnId, taskId);
          setTaskId(taskId);
          setColumnId(columnId);
          setTaskTitle(task?.title);
          setTaskDescription(task?.description);
          setTaskDate(task?.date);
          setTaskTime(task?.time);
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
