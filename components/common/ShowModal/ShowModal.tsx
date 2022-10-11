import { Menu, MenuItem, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { columnsState } from "../../../atoms/columnsAtom";
import InputField, { Input, InputContainer, Label } from "../InputField";
import {
  Option,
  PLACEHOLDER,
  Select,
  TextArea,
} from "../NewTaskModal/NewTaskModal";
import { modalStyle } from "../AddModal/AddModal";
import { darkTheme } from "../../../styles/color";
import styled from "styled-components";
import { selectedTask } from "../../../atoms/selectedTask";
import { doneCount } from "../../../services/doneCount";
import { useState, useCallback } from "react";
import { canEditTaskState } from "../../../atoms/canEditTaskState";
import { BorderColorOutlined, DeleteOutline } from "@mui/icons-material";
import { deleteDocument, updateDocument } from "../../../utils/request";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef } from "react";
import { Button } from "../Button";
import DoneIcon from "@mui/icons-material/Done";
import { useUpdateColumns } from "../../../hooks/useUpdateColumns/useUpdateColumns";
import { SubTaskType, TaskType } from "../../../types/task";

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const changeData = useRef(false);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const columns = useRecoilValue(columnsState);
  const [showTask, setShowTask] = useRecoilState(selectedTask);
  const [canEditTask, setCanEditTask] = useRecoilState(canEditTaskState);
  const [subTaskCount, setCount] = useState(1);
  const { updateTask, deleteTask, deleteAndInsert } = useUpdateColumns();

  // New SUBTASK
  const addSubTask = useCallback(() => {
    const subInput = document.querySelectorAll(
      "input[name='sub-task']"
    ) as unknown as HTMLInputElement[] | null;
    if (subInput?.[subTaskCount - 1]?.value) {
      setCount(subTaskCount + 1);
    }
  }, [subTaskCount]);

  const changeSubTaskStatus = useCallback(
    (clickedSubTask: SubTaskType) => {
      setShowTask((selectedTask) => {
        const copyedTasks: SubTaskType[] = [];
        selectedTask?.subTasks?.forEach((subTask) => {
          subTask.id === clickedSubTask.id &&
          subTask.name === clickedSubTask.name
            ? copyedTasks.push({ ...subTask, status: !subTask.status })
            : copyedTasks.push(subTask);
        });
        return { ...selectedTask, subTasks: copyedTasks } as TaskType;
      });
      changeData.current = true;
    },
    [setShowTask]
  );

  const changeTaskStatus = useCallback(
    (newColId: string) => {
      setShowTask(
        (selectedTask) =>
          ({
            ...selectedTask,
            oldColId: selectedTask?.columnId,
            columnId: newColId,
          } as TaskType)
      );
      changeData.current = true;
    },
    [setShowTask]
  );

  const saveTask = useCallback(() => {
    if (!showTask?.name) {
      alert("Name cannot be empty.");
      return;
    }
    handleClose();
    // Checking for
    const subInputs = document.querySelectorAll(
      "input[name='sub-task']"
    ) as unknown as HTMLInputElement[] | null;
    const subTasks: SubTaskType[] = [];
    subInputs?.forEach((subInput, i) => {
      if (subInput.value)
        subTasks.push({
          id: Date.now() + i,
          name: subInput.value,
          status: false,
        });
    });
    const newShowTask =
      subTasks.length > 0
        ? { ...showTask, subTasks: [...showTask.subTasks, ...subTasks] }
        : showTask;
        if (subTasks.length > 0) setShowTask(newShowTask);
    const {oldColId, ...task} = showTask;
    updateDocument(`tasks/${showTask.id}`, task)
      .then((res) => {
        // Change Task in Column
        updateTask({...newShowTask});
      })
      .catch((error) => {
        console.log("Error Updating Task :---: ", error);
        alert("Error Occured. Reverting Back the changes");
        // Revert Back showTask
        setShowTask((oldTask) => {
          const myCol = columns.find((col) => col.id === showTask.columnId);
          return myCol?.items?.find(
            (task) => task.id === showTask.id
          ) as TaskType;
        });
      });
    setCanEditTask(false);
  }, [columns, handleClose, setCanEditTask, setShowTask, showTask, updateTask]);

  const beforeClose = useCallback(() => {
    if (changeData.current && showTask) {
      const {oldColId, ...task} = showTask;
      updateDocument(`tasks/${showTask.id}`, task)
        .then((res) => {
          // Change Task in Column
          showTask.oldColId
            ? deleteAndInsert(showTask.oldColId, task)
            : updateTask(task);
        })
        .catch((error) => {
          console.log("Error Updating Task :---: ", error);
          alert("Error Occured. Reverting Back the changes");
          // Revert Back showTask
          setShowTask((oldTask) => {
            const myCol = columns.find((col) => col.id === showTask.columnId);
            return myCol?.items?.find(
              (task) => task.id === showTask.id
            ) as TaskType;
          });
        });
      changeData.current = false;
    }
    setShowTask(null);
    setCount(1);
  }, [columns, deleteAndInsert, setShowTask, showTask, updateTask]);

  // On Delete Task
  const handleDeleteTask = useCallback(() => {
    // Make a request for delete
    if (!showTask) return;
    deleteDocument(`tasks/${showTask?.id}`)
      .then((res) => {
        // Delete Successful, filter col.
        deleteTask(showTask);
        setShowTask(null);
      })
      .catch((error) => console.log("Error Deleting Task :---: ", error));
  }, [showTask, deleteTask, setShowTask]);

  const checkAndReplace = useCallback(
    (value: string | number, type: "name" | "description" | "subTask") => {
      switch (type) {
        case "name":
          if (showTask?.name !== value)
            setShowTask({ ...showTask, name: value } as TaskType);
          break;
        case "description":
          if (showTask?.description !== value)
            setShowTask({ ...showTask, description: value } as TaskType);
          break;
        case "subTask":
          setShowTask(
            (oldTask) =>
              ({
                ...oldTask,
                subTasks: oldTask?.subTasks?.filter(
                  (subTask) => subTask.id !== value
                ),
              } as TaskType)
          );
          break;
        default:
          break;
      }
    },
    [setShowTask, showTask]
  );

  if (!showTask) return <></>;

  return (
    <Modal
      open={!!showTask}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {canEditTask ? (
              <Input
                style={{
                  padding: "4px",
                  fontSize: ".8rem",
                  border: "none",
                  backgroundColor: darkTheme.bodyBg,
                }}
                defaultValue={showTask.name}
                onBlur={(e) =>
                  checkAndReplace(e.currentTarget.value || "", "name")
                }
              />
            ) : (
              <span>{showTask?.name ?? "THIS IS A TITLE"}</span>
            )}
            <MoreVertIcon onClick={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {!!canEditTask ? (
                <MenuItem onClick={saveTask}>
                  <DoneIcon /> Save
                </MenuItem>
              ) : (
                <>
                  <MenuItem onClick={handleDeleteTask}>
                    <DeleteOutline /> Delete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setCanEditTask(true);
                    }}
                  >
                    <BorderColorOutlined /> Edit
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {canEditTask ? (
              <TextArea
                style={{
                  padding: "4px",
                  fontSize: ".8rem",
                  border: "none",
                  backgroundColor: darkTheme.bodyBg,
                }}
                defaultValue={showTask.description}
                onBlur={(e) =>
                  checkAndReplace(e.currentTarget.value || "", "description")
                }
              />
            ) : (
              <>
              {
                showTask?.description &&
                <Description>{showTask.description}</Description>
              }
              </>
            )}
          {showTask && !!showTask.subTasks?.length && (
            <>
              <Label>
                Subtasks({doneCount(showTask.subTasks || [])} of{" "}
                {showTask.subTasks?.length})
              </Label>
              <InputContainer margin="1rem auto 0">
                {showTask.subTasks?.map((subTask) => (
                  <SubTaskCover key={subTask.name}>
                    <Input
                      width="auto"
                      id="subTaskID"
                      type="checkbox"
                      checked={subTask.status}
                      onChange={() => changeSubTaskStatus(subTask)}
                      disabled={canEditTask}
                    />
                    <Label
                      htmlFor={"subTaskID"}
                      labelSize="0.85rem"
                      block="block"
                      style={{
                        margin: 0,
                        display: "flex",
                        flexGrow: "1",
                        width: "100%",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      {subTask.name}
                      {canEditTask && (
                        <DeleteIcon
                          style={{
                            color: "red",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                          onClick={() => checkAndReplace(subTask.id, "subTask")}
                        />
                      )}
                    </Label>
                  </SubTaskCover>
                ))}
                {canEditTask && (
                  <>
                    <SubTaskCover style={{flexDirection: "column"}}>
                      {[...new Array(subTaskCount)].map((item, i) => (
                        <Input
                          style={{
                            padding: "4px",
                            fontSize: ".8rem",
                          }}
                          key={i}
                          margin="4px 0"
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
                  </>
                )}
              </InputContainer>
            </>
          )}
          {!canEditTask && (
            <InputContainer margin="1rem auto 0">
              <Label
                htmlFor="sub-task"
                labelSize="0.9rem"
                style={{ margin: 0 }}
                block="inline-block"
              >
                Status
              </Label>
              <Select
                id="status"
                name="status"
                onChange={(e) => changeTaskStatus(e?.target?.value)}
              >
                {columns.map((column, index) => (
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
          )}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ShowModal;
