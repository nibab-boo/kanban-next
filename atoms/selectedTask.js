import { atom } from 'recoil';

export const selectedTask = atom({
  key: "selectedTask",
  default: null,
})