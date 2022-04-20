import { Column, Task } from "@utils/types";
import {
  addDoc,
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

export async function getProjects(uid: string) {
  try {
    const projectsCollection = collection(firestore, "projects");
    const projectsQuery = query(projectsCollection, where("user", "==", uid));
    const projectsSnapshot = await getDocs(projectsQuery);
    const projects: DocumentData[] = [];
    projectsSnapshot.forEach((doc) => {
      projects.push({ ...doc.data(), id: doc.id });
    });
    return { projects };
  } catch (error) {
    return { error };
  }
}

export async function verifyProjectOwner(
  uid: string,
  projectId: string
): Promise<boolean> {
  try {
    const projectDoc = doc(firestore, `projects/${projectId}`);
    const project = await getDoc(projectDoc);
    if (project.data()?.user === uid) return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function createProject(uid: string, label: string, color: string) {
  try {
    await addDoc(collection(firestore, "projects"), {
      user: uid,
      label: label,
      color: color,
    });
  } catch (error) {
    return { error };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const projectDoc = doc(firestore, "projects", projectId);
    await deleteDoc(projectDoc);
  } catch (error) {
    return { error };
  }
}

export async function getColumns(projectId: string) {
  try {
    const columnsCollection = collection(
      firestore,
      `projects/${projectId}/columns`
    );
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

export async function createColumn(projectId: string, newColumn: Column) {
  try {
    const columnDoc = doc(
      firestore,
      `projects/${projectId}/columns`,
      newColumn.id
    );
    await setDoc(columnDoc, {
      project: projectId,
      title: newColumn.title,
      position: newColumn.position,
      createdAt: new Date(),
    });
  } catch (error) {
    return { error };
  }
}

export async function updateColumnTitle(
  projectId: string,
  columnId: string,
  title: string
) {
  try {
    const columnDoc = doc(firestore, `projects/${projectId}/columns`, columnId);
    await updateDoc(columnDoc, { title });
  } catch (error) {
    return { error };
  }
}

export async function moveColumn(
  projectId: string,
  oldColumnPosition: number,
  newColumnPosition: number
) {
  try {
    const columnsRef = collection(firestore, `projects/${projectId}/columns`);
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

export async function deleteColumn(projectId: string, columnId: string) {
  try {
    const columnDoc = doc(firestore, `projects/${projectId}/columns`, columnId);
    await deleteDoc(columnDoc);
  } catch (error) {
    return { error };
  }
}

export async function getTasks(projectId: string, columnId: string) {
  try {
    const tasksCollection = collection(
      firestore,
      `projects/${projectId}/columns/${columnId}/tasks`
    );
    const tasksQuery = query(tasksCollection);
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasks: DocumentData[] = [];
    tasksSnapshot.forEach((doc) => tasks.push({ ...doc.data(), id: doc.id }));
    return { tasks };
  } catch (error) {
    return { error };
  }
}

export async function createTask(
  projectId: string,
  columnId: string,
  newTask: Task
) {
  try {
    const tasksDoc = doc(
      firestore,
      `projects/${projectId}/columns/${columnId}/tasks`,
      newTask.id
    );
    await setDoc(tasksDoc, {
      project: projectId,
      title: newTask.title,
      description: newTask.description,
      createdAt: new Date(),
      dueDate: newTask.dueDate ?? 0,
      dueTime: newTask.dueTime ?? 0,
    });
  } catch (error) {
    return { error };
  }
}

export async function updateTask(
  projectId: string,
  columnId: string,
  task: Task
) {
  try {
    const tasksDoc = doc(
      firestore,
      `projects/${projectId}/columns/${columnId}/tasks`,
      task.id
    );
    await updateDoc(tasksDoc, {
      title: task.title,
      description: task.description,
      updatedAt: new Date(),
      dueDate: task.dueDate ?? 0,
      dueTime: task.dueTime ?? 0,
    });
  } catch (error) {
    return { error };
  }
}

export async function checkTask(
  projectId: string,
  columnId: string,
  taskId: string,
  completed: boolean
) {
  try {
    const tasksDoc = doc(
      firestore,
      `projects/${projectId}/columns/${columnId}/tasks`,
      taskId
    );
    await updateDoc(tasksDoc, {
      completed: completed,
      updatedAt: new Date(),
    });
  } catch (error) {
    return { error };
  }
}

export async function deleteTask(
  projectId: string,
  columnId: string,
  taskId: string
) {
  try {
    const tasksDoc = doc(
      firestore,
      `projects/${projectId}/columns/${columnId}/tasks`,
      taskId
    );
    await deleteDoc(tasksDoc);
  } catch (error) {
    return { error };
  }
}

export async function moveTask(
  projectId: string,
  oldColumnId: string,
  newColumnId: string,
  taskId: string
) {
  try {
    if (oldColumnId !== newColumnId) {
      const oldTaskRef = doc(
        firestore,
        `projects/${projectId}/columns/${oldColumnId}/tasks`,
        taskId
      );
      const newTaskRef = doc(
        firestore,
        `projects/${projectId}/columns/${newColumnId}/tasks`,
        taskId
      );
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
