import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firestore from "./firebase";

type Task = {
  description: string;
  name: string;
  createdAt: number;
  column: number;
  index: number;
  completed: boolean;
  id: string;
};

export async function getTasks() {
  try {
    const tasksCollection = collection(firestore, "tasks");
    const tasksQuery = query(tasksCollection);
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasks: DocumentData[] = [];
    tasksSnapshot.forEach((doc) => tasks.push({ ...doc.data(), id: doc.id }));
    return { tasks };
  } catch (error) {
    return { error };
  }
}

export async function createTask({
  name,
  description,
  index,
  column,
  completed,
  createdAt,
  id,
}: Task) {
  try {
    const taskDoc = doc(firestore, `tasks/${id}`);
    const taskData = {
      name,
      description,
      index,
      column,
      completed,
      createdAt,
    };
    await setDoc(taskDoc, taskData);
  } catch (error) {
    return { error };
  }
}

export async function updateTaskIndex(id: string, newIndex: number) {
  try {
    const taskDoc = doc(firestore, `tasks/${id}`);
    await updateDoc(taskDoc, {
      index: newIndex,
    });
  } catch (error) {
    return { error };
  }
}
