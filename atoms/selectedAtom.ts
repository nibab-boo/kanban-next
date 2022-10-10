import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ProjectType } from "../types/project";

const { persistAtom } = recoilPersist();

export const selectedState = atom<ProjectType | null>({
  key: "selectedState",
  default: null,
  effects_UNSTABLE: [persistAtom],
})