import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import firestore from "./firebase";

type Task = {
  id: string;
  description: string;
  title: string;
  label: string;
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

export async function createTask(
  columnId: string,
  tasks: Task[],
  { id, title, description, label }: Task
) {
  try {
    const tasksDoc = doc(firestore, `columns/${columnId}`);
    const tasksData = [
      ...tasks,
      {
        id,
        title,
        description,
        label,
      },
    ];
    await updateDoc(tasksDoc, {
      cards: tasksData,
    });
  } catch (error) {
    return { error };
  }
}
