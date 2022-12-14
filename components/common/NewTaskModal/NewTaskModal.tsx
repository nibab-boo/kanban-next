import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { columnsState } from "../../../atoms/columnsAtom";
import { darkTheme } from "../../../styles/color";
import { modalStyle } from "../AddModal/AddModal";
import { Button } from "../Button";
import InputField, { InputContainer, Label } from "../InputField";
import styled from "styled-components";
import { newTaskModalState } from "../../../atoms/newTaskModalAtom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../core/firebase";
import { selectedState } from "../../../atoms/selectedAtom";
import { useUpdateColumns } from "../../../hooks/useUpdateColumns/useUpdateColumns";
import { SubTaskType, TaskType } from "../../../types/task";

export const PLACEHOLDER = [
  "eg. Get Coffee Beans",
  "eg. Roast Them",
  "eg. Grind them",
  "eg. Make coffee",
  "eg. Drink Coffee and smile",
];

export const Select = styled.select`
  width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  background-color: ${darkTheme.sideBg};
  padding: 8px 14px;
  border: 2px solid ${darkTheme.secondaryText};
  color: ${darkTheme.primaryText};
`;

export const Option = styled.option`
  padding: 8px 14px;
  border: 2px solid ${darkTheme.secondaryText};
  color: ${darkTheme.primaryText};
`;

export const SubTaskCover = styled.div``;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  color: ${darkTheme.primaryText};
  background: ${darkTheme.sideBg};
  border: 2px solid ${darkTheme.secondaryText};
  borderradius: 4px;
`;

const NewTaskModal = () => {
  const [openNewTask, setOpenNewTask] = useRecoilState(newTaskModalState);
  const columns = useRecoilValue(columnsState);
  const selectedBoard = useRecoilValue(selectedState);

  const [subTaskCount, setCount] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const {addNewTask} = useUpdateColumns();

  const onModalClose = useCallback(() => {
    setCount(1);
    setOpenNewTask(false);
  }, [setOpenNewTask]);

  const addSubTask = useCallback(() => {
    const subInput = document.querySelectorAll("input[name='sub-task']")  as unknown as HTMLInputElement[] | null;
    if (subInput?.[subTaskCount - 1]?.value) {
      setCount(subTaskCount + 1);
    }
  }, [subTaskCount]);

  const createTask = useCallback(async () => {
    if (!title) return alert("Title is required.");
    if (selectedBoard === null) return;

    const subInputs = document.querySelectorAll("input[name='sub-task']") as unknown as HTMLInputElement[] | null;
    const subTasks: SubTaskType[] = [];
    subInputs?.forEach((subInput, i) => {
      if (subInput.value)
        subTasks.push({
          id: i,
          name: subInput?.value,
          status: false,
        });
    });

    try {
      const response = await addDoc(collection(db, "tasks"), {
        name: title,
        description: description || null,
        columnId: status || columns?.[0]?.id,
        boardId: selectedBoard.id,
        subTasks: subTasks,
        timestamp: serverTimestamp(),
      });
      const dateTime: Date = new Date();
      const newTask: TaskType = {
        id: response.id,
        name: title,
        description: description ?? '',
        columnId: status || columns?.[0]?.id,
        boardId: selectedBoard.id,
        subTasks: subTasks,
        timestamp: { seconds: dateTime.getTime() / 1000 },
      };
      addNewTask(newTask);
    } catch (error) {
      console.error(error);
    }
    setOpenNewTask(false);
  }, [title, setOpenNewTask, description, status, columns, selectedBoard, addNewTask]);

  return (
    <Modal
      open={openNewTask}
      onClose={onModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ fontWeight: "600" }}
        >
          Add New Task
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <InputField
            name="task_name"
            label="Title"
            containerMargin="1rem auto 0"
            placeholder="eg. Web Design"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e?.target?.value ?? "")}
            required
          />
          <InputContainer margin="1rem auto 0">
            <Label htmlFor={"description"} labelSize="0.9rem" block="block">
              Description
            </Label>
            <TextArea
              rows={4}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e?.target?.value ?? "")}
              placeholder="W Web Design Web Design Web Design Web Design Web Designeb Design Web Design Web Design Web Design"
            />
          </InputContainer>
          <InputContainer margin="1rem auto 0">
            <Label htmlFor="sub-task" labelSize="0.9rem" block="inline-block">
              Sub Tasks
            </Label>
            <SubTaskCover>
              {[...new Array(subTaskCount)].map((item, i) => (
                <InputField
                  key={i}
                  containerMargin="4px 0"
                  name="sub-task"
                  placeholder={PLACEHOLDER[i] ?? "Caff - eind"}
                />
              ))}
            </SubTaskCover>
            <Button
              fullSize
              addSubTask
              margin="1rem auto 0"
              onClick={addSubTask}
            >
              + Add New Subtask
            </Button>
            <Select
              id="status"
              name="status"
              onChange={(e) => setStatus(e?.target?.value ?? "")}
            >
              {columns?.map((column) => (
                <Option key={column.id} value={column.id}>
                  {column.name}
                </Option>
              ))}
            </Select>
          </InputContainer>
          <Button fullSize margin="2rem auto 0" onClick={createTask}>
            Create Task
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

export default NewTaskModal;
