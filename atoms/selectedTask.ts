import { atom } from 'recoil';
import { TaskType } from "../types/task";

export const selectedTask = atom<TaskType | null>({
  key: "selectedTask",
  default: null,
})