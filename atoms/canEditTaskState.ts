import { atom } from 'recoil';

export const canEditTaskState = atom({
  key: "canEditTaskState",
  default: false,
})