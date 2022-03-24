import React, { useState } from "react";
import {
  Button,
  Card,
  Group,
  Modal,
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
import { createTask } from "@lib/db";
import { v4 as uuid } from "uuid";
import Board from "react-trello";

type Task = {
  id: string;
  title: string;
  description: string;
  label: string;
};

type Column = {
  id: string;
  title: string;
  label?: string;
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

const CustomLaneFooter = () => {
  const notifications = useNotifications();
  const [addTaskModalOpened, setAddTaskModalOpened] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLabel, setTaskLabel] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const addTask = async (
    columnId: string,
    title: string,
    description: string,
    label: string
  ) => {
    if (!title.length)
      return notifications.showNotification({
        title: "No name",
        message: "Please enter a task name",
        color: "red",
        icon: <ExclamationMark />,
      });
    if (!label.length)
      return notifications.showNotification({
        title: "No label",
        message: "Please enter a task label",
        color: "red",
        icon: <ExclamationMark />,
      });
    if (!description.length)
      return notifications.showNotification({
        title: "No description",
        message: "Please enter a task description",
        color: "red",
        icon: <ExclamationMark />,
      });
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      label,
    };
    setTaskTitle("");
    setTaskDescription("");
    setSelectedColumn("");
    setAddTaskModalOpened(false);
    return notifications.showNotification({
      title: "Task added",
      message: "Your new task was succesfully added",
      color: "green",
      icon: <Check />,
    });
  };
  return (
    <>
      <Button
        variant="subtle"
        color="dark"
        fullWidth
        radius="md"
        onClick={() => {
          setAddTaskModalOpened(true);
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
      <Modal
        opened={addTaskModalOpened}
        onClose={() => setAddTaskModalOpened(false)}
        title="Add task"
        centered
      >
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
        <TextInput
          placeholder="Enter a task label"
          radius="md"
          size="md"
          variant="default"
          value={taskLabel}
          onChange={(e) => setTaskLabel(e.currentTarget.value)}
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
          <Button
            variant="light"
            onClick={() =>
              addTask(selectedColumn, taskTitle, taskDescription, taskLabel)
            }
          >
            Add
          </Button>
        </Group>
      </Modal>
    </>
  );
};

const DragDrop = () => {
  const theme = useMantineTheme();
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
  return (
    <>
      <Board
        data={boardData}
        draggable
        collapsibleLanes
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
          Card: CustomCard,
          LaneHeader: CustomLaneHeader,
          LaneFooter: CustomLaneFooter,
        }}
      />
      {/* <Grid>
        {[...Array(columns)].map((_, idx: number) => (
          <Grid.Col key={idx} span={3}> */}
      {/* <DragDropContext
              onDragEnd={
                async ({ destination, source }) => {
                  await updateTaskIndex(
                    tasks.find(
                      (task) =>
                        task.index ===
                        source.index +
                          tasks.filter((task) => task.column !== idx).length
                    )?.id || "",
                    (destination?.index || 0) +
                      tasks.filter((task) => task.column !== idx).length
                  );
                  await updateTaskIndex(
                    tasks.find(
                      (task) =>
                        task.index ===
                        (destination?.index || 0) +
                          tasks.filter((task) => task.column !== idx).length
                    )?.id || "",
                    source.index +
                      tasks.filter((task) => task.column !== idx).length
                  );
                  handlers.reorder({
                    from: source.index,
                    to: destination?.index || 0,
                  });
                  setTasks(state);
                  console.log(state);
                }
                // console.log(source.index, destination?.index)
              }
            >
              <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {state
                      .filter((task: Task) => task.column === idx)
                      //   .sort((a: Task, b: Task) => a.index - b.index)
                      .map((task: Task, idx: number) => (
                        <Draggable
                          key={task.id}
                          index={idx}
                          draggableId={task.id}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={cx(classes.item, {
                                [classes.itemDragging]: snapshot.isDragging,
                              })}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <Checkbox color="blue" size="xs" mr={12} />
                              <div>
                                <Text>{task.name}</Text>
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
                                  {task.description}
                                </Text>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext> */}
      {/* <Button
              variant="subtle"
              color="dark"
              fullWidth
              radius="md"
              onClick={() => {
                setAddTaskModalOpened(true);
                setActiveColumn(idx);
              }}
              styles={(theme) => ({
                root: {
                  transition: "all .2s",
                  "&:hover": {
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.fn.darken(theme.colors.dark[5], 0.05)
                        : theme.fn.lighten(theme.colors.gray[1], 0.05),
                    color:
                      theme.colorScheme === "dark" ? theme.white : theme.black,
                  },
                },
              })}
            >
              + Add task
            </Button> */}
      {/* </Grid.Col>
        ))}
      </Grid> */}
    </>
  );
};

export default DragDrop;
