import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const selectedState = atom({
  key: "selectedState",
  default: null,
  effects_UNSTABLE: [persistAtom],
})