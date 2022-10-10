import { Timestamp } from "firebase/firestore";

export type ProjectType = {
  id: string;
  name: string;
  timestamp: Timestamp | string;
  userId: string;
}

export type ProjectsType = ProjectType[];