import { atom } from 'recoil';
import { ColumnsType } from '../types/column';

export const columnsState = atom({
  key: "columnState",
  default: [] as ColumnsType,
})