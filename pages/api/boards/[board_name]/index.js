import { db } from "../../../../core/firebase";
import { collection, getDocs, listCollections, where } from "firebase/firestore";
import { sortBySecond } from "../../../../services/sortBySecond";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({error: "Unauthorized User"});

  const { board_name } = req.query;

  let allColumns = [];
  let allTasks = [];
  try {
    const columnsResponse = await getDocs(
      collection(db, "projects", board_name, "columns")
    );
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
    const myTask = allTasks.filter(task => task.columnId === column.id);
    column.items = myTask ?? [];
  });

  return res.status(200).json({ data: allColumns });
}
