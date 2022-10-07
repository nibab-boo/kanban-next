import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { columnsState } from "../../../atoms/columnsAtom";
import { Input, InputContainer, Label } from "../InputField";
import { Option, Select } from "../NewTaskModal/NewTaskModal";
import { modalStyle } from "../AddModal/AddModal";
import { darkTheme } from "../../../styles/color";
import styled from "styled-components";
import { selectedTask } from "../../../atoms/selectedTask";
import { doneCount } from "../../../services/doneCount";
import { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../core/firebase";

const SubTaskCover = styled.div`
  background-color: ${darkTheme.bodyBg};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
`;  

const Description = styled.p`
  color: ${darkTheme.secondaryText};
  font-size: 0.85rem;
`;

const ShowModal = () => {
  const columns = useRecoilValue(columnsState);
  const [showTask, setShowTask] = useRecoilState(selectedTask);
  const [subTasks, setSubTasks] = useState([]);

  useEffect(() => {
    if (showTask) setSubTasks([...showTask.subTasks]);
  }, [showTask]);

  const changeSubTaskStatus = useCallback((clickedSubTask) => {
    setShowTask((selectedTask) => {
      const copyedTasks = [];
      selectedTask?.subTasks?.forEach((subTask) => {
        (subTask.id === clickedSubTask.id && subTask.name === clickedSubTask.name)
          ? copyedTasks.push({...subTask, status: !subTask.status})
          : copyedTasks.push(subTask)
      });
      return {...selectedTask, subTasks: copyedTasks}
    });
  }, [setShowTask]);

  const changeTaskStatus = useCallback((newColId) => {
    setShowTask((selectedTask) => ({...selectedTask, columnId: newColId}))
  }, [setShowTask])

  const beforeClose = useCallback(() => {
    return null;
    // const docRef = doc(db, "tasks", showTask.id)
    // setDoc(docRef, showTask, { merge: true })
    //   .then((docRef) => console.log("Response of Update :---:", docRef))
    //   .catch(error => console.log('Error :---: ', error));
    // setShowTask(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowTask, showTask])

  if (!showTask) return <></>;

  return (
    <Modal
      open={!!showTask}
      // open={!!showTask}
      onClose={beforeClose}
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
          {showTask?.name ?? "THIS IS A TITLE"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {showTask?.description && (
            <Description>{showTask?.description ?? 'Task Descriptions if There is any'}</Description>
            )}
            <Description>{showTask?.description ?? 'Task Descriptions if There is any'}</Description>
          {showTask && !!showTask?.subTasks?.length && (
            <>
              <Label>
                Subtasks({doneCount(showTask?.subTasks || [])} of{" "}
                {showTask?.subTasks.length})
              </Label>
              <InputContainer margin="1rem auto 0">
                {subTasks.map((subTask) => (
                  <SubTaskCover key={subTask.name}>
                    <Input
                      id="subTaskID"
                      type="checkbox"
                      width="auto"
                      checked={subTask.status}
                      onChange={() => changeSubTaskStatus(subTask)}
                    />
                    <Label
                      htmlFor={"subTaskID"}
                      labelSize="0.85rem"
                      block="block"
                      style={{ margin: 0 }}
                    >
                      {subTask.name}
                    </Label>
                  </SubTaskCover>
                ))}
              </InputContainer>
            </>
          )}
          <InputContainer margin="1rem auto 0">
            <Label htmlFor="sub-task" labelSize="0.9rem" block="inline-block">
              Status
            </Label>
            <Select
              id="status"
              name="status"
              onChange={(e) => changeTaskStatus(e?.target?.value)}
            >
              {columns.map((column, index) => 
                (
                <Option
                  key={column.id}
                  value={column.id}
                  selected={column.id == showTask.columnId}
                >
                  {column.name}
                </Option>
              ))}
            </Select>
          </InputContainer>
        </Typography>
      </Box>
    </Modal>
  );
};

export default ShowModal;
