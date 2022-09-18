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

const PLACEHOLDER = [
  "eg. Get Coffee Beans",
  "eg. Roast Them",
  "eg. Grind them",
  "eg. Make coffee",
  "eg. Drink Coffee and smile",
];

const Select = styled.select`
  width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  background-color: ${darkTheme.sideBg};
  padding: 8px 14px;
  border: 2px solid ${darkTheme.secondaryText};
  color: ${darkTheme.primaryText};
`;

const Option = styled.option`
  padding: 8px 14px;
  border: 2px solid ${darkTheme.secondaryText};
  color: ${darkTheme.primaryText};
`;

const TextArea = styled.textarea`
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

  const [subTaskCount, setCount] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const onModalClose = useCallback(() => {
    setCount(1);
    setOpenNewTask(false);
  }, [setOpenNewTask]);

  const addSubTask = useCallback(() => {
    const subInput = document.querySelectorAll("input[name='sub-task']");
    if (subInput[subTaskCount - 1].value) {
      setCount(subTaskCount + 1);
    }
  }, [subTaskCount]);

  const createTask = useCallback(() => {
    console.log("title", title);
    console.log("status", status);
    if (!title || !status) alert("Title and status fields are required.");
    console.log("Button Clicked");
    const subInputs = document.querySelectorAll("input[name='sub-task']");
    const subTasks = [];
    subInputs.forEach((subInput, i) => {
      if (subInput.value)
        subTasks.push({
          id: i,
          name: subInput.value,
          status: false,
        });
    });

    console.table({ title, description, status, subTasks })
  }, [title, status, description]);

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
            onChange={(e) => setTitle(e?.target?.value ?? "")}
            required
          />
          <InputContainer margin="1rem auto 0">
            <Label htmlFor={"description"} labelSize="0.9rem" block="block">
              Description
            </Label>
            <TextArea
              rows={4}
              onChange={(e) => setDescription(e?.target?.value ?? "")}
              placeholder="W Web Design Web Design Web Design Web Design Web Designeb Design Web Design Web Design Web Design"
            />
          </InputContainer>
          <InputContainer margin="1rem auto 0">
            <Label htmlFor="sub-task" labelSize="0.9rem" block="inline-block">
              Sub Tasks
            </Label>
            <div>
              {[...new Array(subTaskCount)].map((item, i) => (
                <InputField
                  key={item}
                  containerMargin="4px 0"
                  name="sub-task"
                  placeholder={PLACEHOLDER[i] ?? "Caff - eind"}
                />
              ))}
            </div>
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
              {columns.map((column) => (
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
