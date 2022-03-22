import React, { useState } from "react";
import {
  Button,
  Checkbox,
  createStyles,
  Group,
  Modal,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNotifications } from "@mantine/notifications";
import { Check, ExclamationMark } from "tabler-icons-react";
import { uuid } from "uuidv4";

type ListProps = {
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: number;
  }[];
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

const DragDrop = ({ data }: ListProps) => {
  const { classes, cx } = useStyles();
  const notifications = useNotifications();
  const [state, handlers] = useListState(data);
  const [addTaskModalOpened, setAddTaskModalOpened] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const addTask = (name: string, description: string) => {
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
    handlers.append({ id: uuid(), name, description, createdAt: Date.now() });
    setTaskName("");
    setTaskDescription("");
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
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination?.index || 0 })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {state.map((item, idx) => (
                <Draggable key={item.id} index={idx} draggableId={item.id}>
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
                        <Text>{item.name}</Text>
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
                          {item.description}
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
            onClick={() => addTask(taskName, taskDescription)}
          >
            Add
          </Button>
        </Group>
      </Modal>
      <Button
        variant="subtle"
        color="dark"
        fullWidth
        radius="md"
        onClick={() => setAddTaskModalOpened(true)}
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
    </>
  );
};

export default DragDrop;
