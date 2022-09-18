import { db } from "../../../core/firebase";
import { collection, doc, getDocs, listCollections, where } from "firebase/firestore";
import { sortBySecond } from "../../../services/sortBySecond";

export default async function handler(req, res) {
  const { board_name } = req.query;

  let allColumns = [];
  let allTasks = [];
  console.log("Board Name :---: ", board_name);
  try {
    const columnsResponse = await getDocs(
      collection(db, "projects", board_name, "columns")
    );
    console.log("BOARD :---: ", columnsResponse);
    columnsResponse?.forEach((doc) => {
      allColumns.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  } catch (error) {
    console.log("ERROR COLUMNS :---: ", error);
    return res.status(500).json({ error: "SERVER ERROR", msg: "At columns fetch" });
  }
  
  allColumns = sortBySecond(allColumns);
  
  try {
    const tasksResponse = await getDocs(
      collection(db, "tasks"),
      where("boardId", "==", board_name),
      );
      console.log("TASKS :---: ", tasksResponse);
      tasksResponse?.forEach((doc) => {
        allTasks.push({
          id: doc.id,
          ...doc.data(),
        });
      });
  } catch (error) {
    console.log("ERROR TASKS :---: ", error);
    return res.status(500).json({ error: "SERVER ERROR", msg: "At tasks fetch" });
  }

  allColumns.forEach(column => {
    const myTask = allTasks.find(task => task.columnId === column.id);
    column.items = myTask ?? null;
  });

  return res.status(200).json({ data: allColumns });
}
