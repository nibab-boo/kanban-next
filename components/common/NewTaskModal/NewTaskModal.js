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
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  background-color: ${darkTheme.sideBg};
  border: 2px solid ${darkTheme.secondaryText};
  color: white;
`;
const Option = styled.option``;

const TextArea = styled.textarea`
  width: 100%,
  padding: 10px,
  color: ${darkTheme.primaryText},
  background: ${darkTheme.sideBg},
  border: 2px solid ${darkTheme.secondaryText},
  borderRadius: 4px,
`

const NewTaskModal = () => {
  const [openNewTask, setOpenNewTask] = useRecoilState(newTaskModalState);
  const [subTaskCount, setCount] = useState(1);
  const columns = useRecoilValue(columnsState);

  const onModalClose = useCallback(() => {
    setCount(1);
    setOpenNewTask(false);
  }, [setOpenNewTask])

  const addSubTask = useCallback(() => {
    const subInput = document.querySelectorAll("input[name='sub-task']");
    if (subInput[subTaskCount - 1].value) {
      setCount(subTaskCount + 1);
    }
  }, [subTaskCount]);

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
            name="board_name"
            label="Title"
            containerMargin="1rem auto 0"
            placeholder="eg. Web Design"
            onChange={(e) => setKeyword(e?.target?.value ?? "")}
          />
          <InputContainer margin="1rem auto 0">
            <Label
              htmlFor={"description"}
              labelSize="0.9rem"
              block="inline-block"
            >
              Description
            </Label>
            <TextArea
              rows={3}
              placeholder="W Web Design Web Design Web Design Web Design Web Designeb Design Web Design Web Design Web Design"
            ></TextArea>
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
              onChange={(e) => console.log("Current Target :---: ", e.currentTarget.value)}
            >
              {columns.map((column) => (
                <Option key={column.id} value={column.id}>
                  {column.name}
                </Option>
              ))}
            </Select>
          </InputContainer>
          <Button
            fullSize
            margin="2rem auto 0"
            onClick={() => console.log("Button clicked!!!")}
          >
            Create Task
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

export default NewTaskModal;
