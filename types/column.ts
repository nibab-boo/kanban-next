import { Timestamp } from "firebase/firestore";
import { TaskType } from "./task";

export type ColumnType = {
  boardId: string;
  id: string;
  items: TaskType[];
  name: string;
  timestamp: Timestamp | string;
  userId: string;
}

export type ColumnsType = ColumnType[];