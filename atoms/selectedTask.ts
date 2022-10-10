import { atom } from 'recoil';
import { TaskType } from "../types/task";

export const selectedTask = atom({
  key: "selectedTask",
  default: null as TaskType | null,
})