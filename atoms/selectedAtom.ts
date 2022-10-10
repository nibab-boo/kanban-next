import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ProjectType } from "../types/project";

const { persistAtom } = recoilPersist();

export const selectedState = atom({
  key: "selectedState",
  default: null as ProjectType | null,
  effects_UNSTABLE: [persistAtom],
})