import React, { useState } from "react";
import { useMantineTheme } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
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
import NewLaneForm from "./NewLaneForm";
import NewCardForm from "./NewCardForm";
import AddCardLink from "./AddCardLink";
import Card from "./Card";
import LaneHeader from "./LaneHeader";
import NewLaneSection from "./NewLaneSection";

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
        onCardDelete={onDeleteCard}
        onLaneAdd={onNewColumn}
        onCardMoveAcrossLanes={onMoveCard}
        handleLaneDragEnd={onMoveColumn}
      />
    </>
  );
};

export default DragDrop;
