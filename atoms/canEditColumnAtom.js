import { atom } from 'recoil';

export const canEditColumnState = atom({
  key: "canEditColumnState",
  default: false,
})