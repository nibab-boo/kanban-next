import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { columnsState } from "../../atoms/columnsAtom";

export const useUpdateColumns = () => {
  const [columns, setColumns] = useRecoilState(columnsState);

  // Add New Task
  const addNewTask = useCallback(
    (newTask) =>
      setColumns((old) => {
        let clone = [...old];
        const index = clone.findIndex(
          (column) => column.id === newTask.columnId
        );
        let col = { ...clone[index] };
        let items = [...col.items];
        col.items = [...items, newTask];
        clone[index] = col;
        return clone;
      }),
    [setColumns]
  );

  // Update existing task with new Task
  const updateTask = useCallback(
    (newTask) => {
      setColumns((oldColumns) => {
        const newCols = [];
        oldColumns?.forEach((oldCol) => {
          if (oldCol.id === newTask.columnId) {
            const newTasks = [];
            oldCol?.items?.forEach((task) =>
              task.id === newTask.id
                ? newTasks.push(newTask)
                : newTasks.push(task)
            );
            newCols.push({ ...oldCol, items: newTasks });
          } else {
            newCols.push(oldCol);
          }
        });
        return newCols;
      });
    },
    [setColumns]
  );

  // Delete and Insert New Task
  const deleteAndInsert = useCallback(
    (removeFrom, toAddTask) => {
      console.table({ removeFrom, toAddTask });
      setColumns((oldColumns) => {
        const newCols = [];
        oldColumns?.forEach((oldCol) => {
          if (oldCol.id === toAddTask.columnId) {
            newCols.push({ ...oldCol, items: [...oldCol.items, toAddTask] });
          } else if (oldCol.id === removeFrom) {
            newCols.push({
              ...oldCol,
              items: oldCol.items?.filter((task) => task.id !== toAddTask.id),
            });
          } else {
            newCols.push(oldCol);
          }
        });
        return newCols;
      });
    },
    [setColumns]
  );

  // Delete a task
  const deleteTask = useCallback(
    (oldTask) =>
      setColumns((oldColumns) => {
        const newCols = [];
        oldColumns.forEach((oldCol) => {
          oldCol?.items.find((task) => task?.id === oldTask?.id)
            ? newCols.push({
                ...oldCol,
                items: oldCol?.items?.filter(
                  (task) => task.id !== oldTask?.id
                ),
              })
            : newCols.push(oldCol);
        });
        return newCols;
      }),
    [setColumns]
  );

  return { updateTask, deleteAndInsert, addNewTask, deleteTask };
};
