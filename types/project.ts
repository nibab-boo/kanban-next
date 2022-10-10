import { Timestamp } from "firebase/firestore";

export type ProjectType = {
  id: string;
  name: string;
  timestamp: Timestamp | {seconds: number};
  userId: string;
}

export type ProjectsType = ProjectType[];