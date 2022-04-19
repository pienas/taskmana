import { Column, Task } from "@utils/types";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import firestore from "./firebase";

export async function getColumns() {
  try {
    const columnsCollection = collection(firestore, "columns");
    const columnsQuery = query(columnsCollection);
    const columnsSnapshot = await getDocs(columnsQuery);
    const columns: DocumentData[] = [];
    columnsSnapshot.forEach((doc) =>
      columns.push({ ...doc.data(), id: doc.id })
    );
    return { columns };
  } catch (error) {
    return { error };
  }
}

export async function createColumn(newColumn: Column) {
  try {
    const tasksDoc = doc(firestore, "columns", newColumn.id);
    await setDoc(tasksDoc, {
      title: newColumn.title,
      position: newColumn.position,
      createdAt: new Date(),
    });
  } catch (error) {
    return { error };
  }
}

export async function updateColumnTitle(columnId: string, title: string) {
  try {
    const columnDoc = doc(firestore, "columns", columnId);
    await updateDoc(columnDoc, { title });
  } catch (error) {
    return { error };
  }
}

export async function deleteColumn(columnId: string) {
  try {
    const columnDoc = doc(firestore, "columns", columnId);
    await deleteDoc(columnDoc);
  } catch (error) {
    return { error };
  }
}

export async function getTasks(columnId: string) {
  try {
    const tasksCollection = collection(firestore, `columns/${columnId}/tasks`);
    const tasksQuery = query(tasksCollection);
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasks: DocumentData[] = [];
    tasksSnapshot.forEach((doc) => tasks.push({ ...doc.data(), id: doc.id }));
    return { tasks };
  } catch (error) {
    return { error };
  }
}

export async function createTask(columnId: string, newTask: Task) {
  try {
    const tasksDoc = doc(firestore, `columns/${columnId}/tasks`, newTask.id);
    await setDoc(tasksDoc, {
      title: newTask.title,
      description: newTask.description,
      createdAt: new Date(),
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
    });
  } catch (error) {
    return { error };
  }
}

export async function updateTask(columnId: string, task: Task) {
  try {
    const tasksDoc = doc(firestore, `columns/${columnId}/tasks`, task.id);
    await updateDoc(tasksDoc, {
      title: task.title,
      description: task.description,
      updatedAt: new Date(),
      dueDate: task.dueDate,
      dueTime: task.dueTime,
    });
  } catch (error) {
    return { error };
  }
}

export async function checkTask(
  columnId: string,
  taskId: string,
  completed: boolean
) {
  try {
    const tasksDoc = doc(firestore, `columns/${columnId}/tasks`, taskId);
    await updateDoc(tasksDoc, {
      completed: completed,
      updatedAt: new Date(),
    });
  } catch (error) {
    return { error };
  }
}

export async function deleteTask(columnId: string, taskId: string) {
  try {
    const tasksDoc = doc(firestore, `columns/${columnId}/tasks`, taskId);
    await deleteDoc(tasksDoc);
  } catch (error) {
    return { error };
  }
}

export async function moveTask(
  oldColumnId: string,
  newColumnId: string,
  taskId: string
) {
  try {
    if (oldColumnId !== newColumnId) {
      const oldTaskRef = doc(firestore, `columns/${oldColumnId}/tasks`, taskId);
      const newTaskRef = doc(firestore, `columns/${newColumnId}/tasks`, taskId);
      const taskSnapshot = await getDoc(oldTaskRef);
      if (taskSnapshot.exists()) {
        await deleteDoc(oldTaskRef);
        await setDoc(newTaskRef, {
          title: taskSnapshot.data().title,
          description: taskSnapshot.data().description,
          createdAt: taskSnapshot.data().createdAt,
          updatedAt: taskSnapshot.data().updatedAt,
          dueAt: taskSnapshot.data().dueAt,
        });
      } else console.error("Task does not exist");
    }
  } catch (error) {
    return { error };
  }
}

export async function moveColumn(
  oldColumnPosition: number,
  newColumnPosition: number
) {
  try {
    const columnsRef = collection(firestore, "columns");
    const oldColumnQuery = query(
      columnsRef,
      where("position", "==", oldColumnPosition),
      limit(1)
    );
    const oldColumnSnapshot = await getDocs(oldColumnQuery);
    oldColumnSnapshot.forEach(async (document) => {
      const oldColumnId = document.id;
      const oldColumnRef = doc(firestore, `columns/${oldColumnId}`);
      await updateDoc(oldColumnRef, {
        position: newColumnPosition,
      });
    });
    if (Math.abs(oldColumnPosition - newColumnPosition) <= 1) {
      const newColumnQuery = query(
        columnsRef,
        where("position", "==", newColumnPosition),
        limit(1)
      );
      const newColumnSnapshot = await getDocs(newColumnQuery);
      newColumnSnapshot.forEach(async (document) => {
        const newColumnId = document.id;
        const newColumnRef = doc(firestore, `columns/${newColumnId}`);
        await updateDoc(newColumnRef, {
          position: oldColumnPosition,
        });
      });
    } else {
      let tempColumnPosition = newColumnPosition;
      for (
        let i = 0;
        i < Math.abs(oldColumnPosition - newColumnPosition);
        i++
      ) {
        const newColumnQuery = query(
          columnsRef,
          where("position", "==", tempColumnPosition),
          limit(1)
        );
        const newColumnSnapshot = await getDocs(newColumnQuery);
        newColumnSnapshot.forEach(async (document) => {
          const newColumnId = document.id;
          const newColumnRef = doc(firestore, `columns/${newColumnId}`);
          if (oldColumnPosition - newColumnPosition > 0) {
            await updateDoc(newColumnRef, {
              position: ++tempColumnPosition,
            });
          } else {
            await updateDoc(newColumnRef, {
              position: --tempColumnPosition,
            });
          }
        });
      }
    }
  } catch (error) {
    return { error };
  }
}
