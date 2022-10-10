import { Timestamp } from "firebase/firestore"

export type SubTaskType = {
  id: string | number;
  name: string;
  status: boolean;
}

export interface TaskType {
  boardId: string;
  columnId: string;
  description?: string;
  id: string;
  name: string;
  subTasks: SubTaskType[];
  oldColId?: string;
  timestamp: Timestamp | {seconds: number};
}