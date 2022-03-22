import React, { useState } from "react";
import {
  Button,
  Checkbox,
  createStyles,
  Grid,
  Group,
  Modal,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNotifications } from "@mantine/notifications";
import { Check, ExclamationMark } from "tabler-icons-react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import { createTask, updateTaskIndex } from "@lib/db";
import { v4 as uuid } from "uuid";
import { useListState } from "@mantine/hooks";

type Task = {
  description: string;
  name: string;
  createdAt: number;
  column: number;
  index: number;
  completed: boolean;
  id: string;
};

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
    height: "100px",
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },
}));

const DragDrop = () => {
  const { classes, cx } = useStyles();
  const notifications = useNotifications();
  const { data } = useSWR("/api/tasks", fetcher);
  const [state, handlers] = useListState<Task>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskModalOpened, setAddTaskModalOpened] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [activeColumn, setActiveColumn] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  if (!data) return <>Loading...</>;
  if (!tasks.length) {
    new Promise((resolve) => {
      resolve("Data passed");
    }).then(() => {
      setTasks(data.tasks);
      handlers.setState(data.tasks);
      setLastIndex(Math.max(...data.tasks.map((task: Task) => task.index), 0));
    });
  }
  const columns = Math.max(...tasks.map((task: Task) => task.column), 0) + 1;
  const addTask = async (name: string, description: string, column: number) => {
    if (!name.length)
      return notifications.showNotification({
        title: "No name",
        message: "Please enter a task name",
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
    //   handlers.append({ id: uuid(), name, description, createdAt: Date.now() });
    const newTask: Task = {
      name: taskName,
      description: taskDescription,
      index: lastIndex + 1,
      column: column,
      completed: false,
      createdAt: Date.now(),
      id: uuid(),
    };
    await createTask(newTask);
    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskDescription("");
    setActiveColumn(0);
    setLastIndex(lastIndex + 1);
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
      <Grid>
        {[...Array(columns)].map((_, idx: number) => (
          <Grid.Col key={idx} span={3}>
            <DragDropContext
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
            </DragDropContext>
            <Button
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
            </Button>
          </Grid.Col>
        ))}
      </Grid>
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
          value={taskName}
          onChange={(e) => setTaskName(e.currentTarget.value)}
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
            onClick={() => addTask(taskName, taskDescription, activeColumn)}
          >
            Add
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default DragDrop;
