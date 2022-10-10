import { Timestamp } from "firebase/firestore";
import { TaskType } from "./task";

export type ColumnType = {
  boardId: string;
  id: string;
  items: TaskType[];
  name: string;
  timestamp: Timestamp | {seconds: number};
  userId: string;
}

export type ColumnsType = ColumnType[];