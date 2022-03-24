import React, { useState } from "react";
import {
  Button,
  Group,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import {
  Check,
  DotsVertical,
  ExclamationMark,
  Plus,
  Trash,
} from "tabler-icons-react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import {
  createColumn,
  createTask,
  deleteTask,
  moveColumn,
  moveTask,
} from "@lib/db";
import Board from "react-trello";
import { v4 as uuid } from "uuid";

type Task = {
  id: string;
  title: string;
  description: string;
};

type Column = {
  id: string;
  title: string;
  cards?: Array<Task>;
  position: number;
};

const CustomCard = ({ title, description, onDelete }) => {
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

const CustomLaneHeader = ({ title }) => {
  return (
    <Group position="apart" style={{ cursor: "grab" }}>
      <Text weight={600}>{title}</Text>
      <Group spacing="xs">
        <Button
          variant="subtle"
          color="dark"
          size="lg"
          compact
          radius="md"
          p={0}
          styles={(theme) => ({
            root: {
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
          <Plus />
        </Button>
        <Button
          variant="subtle"
          color="dark"
          size="lg"
          compact
          radius="md"
          p={0}
          styles={(theme) => ({
            root: {
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
          <DotsVertical />
        </Button>
      </Group>
    </Group>
  );
};

const CustomAddCardLink = ({ onClick }) => {
  return (
    <Button
      variant="subtle"
      color="dark"
      fullWidth
      radius="md"
      onClick={() => {
        onClick();
      }}
      styles={(theme) => ({
        root: {
          transition: "all .2s",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.fn.darken(theme.colors.dark[5], 0.05)
                : theme.fn.lighten(theme.colors.gray[1], 0.05),
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
          },
        },
      })}
    >
      + Add task
    </Button>
  );
};

const CustomNewLaneSection = ({ onClick }) => {
  return (
    <Button
      variant="subtle"
      color="dark"
      fullWidth
      size="lg"
      radius="md"
      onClick={() => {
        onClick();
      }}
      styles={(theme) => ({
        root: {
          transition: "all .2s",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.fn.darken(theme.colors.dark[5], 0.05)
                : theme.fn.lighten(theme.colors.gray[1], 0.05),
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
          },
        },
      })}
    >
      + Add column
    </Button>
  );
};

const CustomNewCardForm = ({ onCancel, onAdd }) => {
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

const CustomNewLaneForm = ({ onCancel, onAdd }) => {
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
    <>
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
    </>
  );
};

const DragDrop = () => {
  const theme = useMantineTheme();
  const notifications = useNotifications();
  const { data: originalColumns } = useSWR("/api/columns", fetcher);
  const [columns, setColumns] = useState<Column[]>([]);
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
      <Board
        data={boardData}
        draggable
        editable
        canAddLanes
        style={{
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        }}
        laneStyle={{
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        }}
        components={{
          AddCardLink: CustomAddCardLink,
          Card: CustomCard,
          LaneHeader: CustomLaneHeader,
          NewCardForm: CustomNewCardForm,
          NewLaneForm: CustomNewLaneForm,
          NewLaneSection: CustomNewLaneSection,
        }}
        onCardAdd={onNewCard}
        onCardDelete={onDeleteCard}
        onLaneAdd={onNewColumn}
        onCardMoveAcrossLanes={onMoveCard}
        handleLaneDragEnd={onMoveColumn}
      />
    </>
  );
};

export default DragDrop;
