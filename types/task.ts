import { Timestamp } from "firebase/firestore"

export type SubTaskType = {
  id: string | number;
  name: string;
  status: boolean;
}

export type TaskType = {
  boardId: string;
  columnId: string;
  description?: string;
  id: string;
  name: string;
  subTasks: SubTaskType[];
  timestamp: Timestamp | {seconds: number};
}