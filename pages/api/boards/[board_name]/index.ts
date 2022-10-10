import { db } from "../../../../core/firebase";
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  getDocs,
  query,
  TaskState,
  where,
} from "firebase/firestore";
import { sortBySecond } from "../../../../services/sortBySecond";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { ColumnsType, ColumnType } from "../../../../types/column";
import { TaskType } from "../../../../types/task";
import { FirebaseApp } from "firebase/app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "Unauthorized User" });

  const { board_name } = req.query;

  if (!board_name) {
    res.status(400).json({error: "Invalid Project"})
  }

  let allColumns: ColumnsType = [];
  let allTasks: TaskType[] = [];
  try {
    const colQuery = query(collection(db, "projects", board_name as string, "columns"));

    const columnsResponse = await getDocs(colQuery);
    columnsResponse?.forEach((doc) => {
      allColumns.push({
        id: doc.id,
        ...doc.data(),
      } as ColumnType);
    });
  } catch (error) {
    console.log("ERROR COLUMNS :---: ", error);
    return res
      .status(500)
      .json({ error: "SERVER ERROR", msg: "At columns fetch" });
  }

  allColumns = sortBySecond(allColumns);
  try {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("boardId", "==", board_name)
    );
    const tasksResponse = await getDocs(tasksQuery);
    tasksResponse?.forEach((doc) => {
      allTasks.push({
        id: doc.id,
        ...doc.data(),
      } as TaskType);
    });
  } catch (error) {
    console.log("ERROR TASKS :---: ", error);
    return res
      .status(500)
      .json({ error: "SERVER ERROR", msg: "At tasks fetch" });
  }

  allColumns.forEach((column) => {
    const myTasks: TaskType[] = allTasks.filter(
      (task) => task.columnId === column.id
    );
    column.items = myTasks ?? [];
  });

  return res.status(200).json({ data: allColumns });
}
