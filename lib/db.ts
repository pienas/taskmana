import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import firestore from "./firebase";

type Task = {
  id: string;
  description: string;
  title: string;
};

type Column = {
  id: string;
  title: string;
  position: number;
};

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
    });
  } catch (error) {
    return { error };
  }
}

export async function getTasks(columnId) {
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
    const oldTaskRef = doc(firestore, `columns/${oldColumnId}/tasks`, taskId);
    const newTaskRef = doc(firestore, `columns/${newColumnId}/tasks`, taskId);
    const taskSnapshot = await getDoc(oldTaskRef);
    if (taskSnapshot.exists()) {
      await setDoc(newTaskRef, {
        title: taskSnapshot.data().title,
        description: taskSnapshot.data().description,
      });
      await deleteDoc(oldTaskRef);
    } else console.error("Task does not exist");
  } catch (error) {
    return { error };
  }
}
