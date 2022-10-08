import { Menu, MenuItem, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { useRecoilState } from "recoil";
import { columnsState } from "../../../atoms/columnsAtom";
import { Input, InputContainer, Label } from "../InputField";
import { Option, Select, TextArea } from "../NewTaskModal/NewTaskModal";
import { modalStyle } from "../AddModal/AddModal";
import { darkTheme } from "../../../styles/color";
import styled from "styled-components";
import { selectedTask } from "../../../atoms/selectedTask";
import { doneCount } from "../../../services/doneCount";
import { useEffect, useState, useCallback } from "react";
import { canEditTaskState } from "../../../atoms/canEditTaskState";
import { BorderColorOutlined, DeleteOutline } from "@mui/icons-material";
import { deleteDocument, updateDocument } from "../../../utils/request";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const [columns, setColumns] = useRecoilState(columnsState);
  const [showTask, setShowTask] = useRecoilState(selectedTask);
  const [subTasks, setSubTasks] = useState([]);
  const [canEditTask, setCanEditTask] = useRecoilState(canEditTaskState);

  useEffect(() => {
    if (showTask) setSubTasks([...showTask.subTasks]);
  }, [showTask]);

  const changeSubTaskStatus = useCallback(
    (clickedSubTask) => {
      setShowTask((selectedTask) => {
        const copyedTasks = [];
        selectedTask?.subTasks?.forEach((subTask) => {
          subTask.id === clickedSubTask.id &&
          subTask.name === clickedSubTask.name
            ? copyedTasks.push({ ...subTask, status: !subTask.status })
            : copyedTasks.push(subTask);
        });
        return { ...selectedTask, subTasks: copyedTasks };
      });
      changeData.current = true;
    },
    [setShowTask]
  );

  const changeTaskStatus = useCallback(
    (newColId) => {
      setShowTask((selectedTask) => ({ ...selectedTask, columnId: newColId }));
      changeData.current = true;
    },
    [setShowTask]
  );

  const saveTask = useCallback(() => {
    handleClose();
    updateDocument(`tasks/${showTask.id}`, showTask)
      .then((res) => {
        // Change Task in Column
        setColumns((oldColumns) => {
          const newCols = [];
          oldColumns?.forEach((oldCol) => {
            if (oldCol.id === showTask.columnId) {
              const newTasks = [];
              oldCol?.items?.forEach((task) =>
                task.id === showTask.id
                  ? newTasks.push(showTask)
                  : newTasks.push(task)
              );
              newCols.push({ ...oldCol, items: newTasks });
            } else {
              newCols.push(oldCol);
            }
          });
        });
      })
      .catch((error) => {
        console.log("Error Updating Task :---: ", error);
        alert("Error Occured. Reverting Back the changes");
        showTask((oldTask) => {
          const myCol = columns.find((col) => col.id === showTask.columnId);
          return myCol?.items?.find((task) => task.id === showTask.id);
        })
        // Revert Back showTask
      });
    setCanEditTask(false);
  }, [columns, handleClose, setCanEditTask, setColumns, showTask]);

  const beforeClose = useCallback(() => {
    if (changeData.current) {
      saveTask;
      changeData.current = false;
    }
    setShowTask(null);
  }, [saveTask, setShowTask]);

  // On Delete Task
  const handleDeleteTask = useCallback(() => {
    // Make a request for delete
    deleteDocument(`tasks/${showTask.id}`)
      .then((res) => {
        // Delete Successful, filter col.
        setColumns((oldColumns) => {
          const newCols = [];
          oldColumns.forEach((oldCol) => {
            oldCol?.items.find((task) => task?.id === showTask?.id)
              ? newCols.push({
                  ...oldCol,
                  items: oldCol?.items?.filter(
                    (task) => task.id !== showTask?.id
                  ),
                })
              : newCols.push(oldCol);
          });
        });
        setShowTask(null);
      })
      .catch((error) => console.log("Error Deleting Task :---: ", error));
  }, [showTask, setColumns, setShowTask]);

  const checkAndReplace = useCallback(
    (value, type) => {
      console.table({ type, value });
      switch (type) {
        case "name":
          if (showTask?.name !== value)
            setShowTask({ ...showTask, name: value });
          break;
        case "description":
          if (showTask?.description !== value)
            setShowTask({ ...showTask, description: value });
          break;
        case "subTask":
          setShowTask((oldTask) => ({
            ...oldTask,
            subTasks: oldTask?.subTasks?.filter(
              (subTask) => subTask.id !== value
            ),
          }));
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
                <MenuItem onClick={saveTask}>Save</MenuItem>
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
          {showTask?.description &&
            (canEditTask ? (
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
              <Description>{showTask.description}</Description>
            ))}
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
