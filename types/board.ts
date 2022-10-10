import { Timestamp } from "firebase/firestore";

type Board = {
  id: string;
  name: string;
  timestamp: Timestamp | string;
  userId: string;
};

type BoardsType = Board[];
