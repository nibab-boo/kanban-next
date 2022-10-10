import { atom } from 'recoil';
import { ProjectsType } from '../types/project';

export const projectsState = atom({
  key: "projectsState",
  default: [] as ProjectsType,
})