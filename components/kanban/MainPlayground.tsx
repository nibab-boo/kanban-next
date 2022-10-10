import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { darkTheme } from "../../styles/color";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "../common/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { newColumnModalState } from "../../atoms/newColumnModalAtom";
import { columnsState } from "../../atoms/columnsAtom";
import { newTaskModalState } from "../../atoms/newTaskModalAtom";
import { selectedState } from "../../atoms/selectedAtom";
import { selectedTask } from "../../atoms/selectedTask";
import { doneCount } from "../../services/doneCount";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { projectsState } from "../../atoms/projectsAtoms";
import { deleteReferences, updateDocument } from "../../utils/request";
import { canEditColumnState } from "../../atoms/canEditColumnAtom";
import { Input } from "../common/InputField";
import { useUpdateColumns } from "../../hooks";
import { hideSideBarState } from "../../atoms/hideSideBar";
import { ProjectsType } from "../../types/project";
import { ColumnsType } from "../../types/column";

const MainPlayGroundContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const NewTaskButton = styled(Button)`
  &:after {
    content: "Add new task";
    white-space: pre;
  }
  @media (max-width: 768px) {
    &:after {
      content: "Task";
    }
  }
`;

const Heading = styled.div`
  background: ${darkTheme.sideBg};
  color: ${darkTheme.primaryText};
  height: 5rem;
  display: flex;
  padding: 0 1.2rem;
  align-items: center;
  justify-content: space-between;
`;

const Options = styled.div`
  svg {
    vertical-align: middle;
  }
`;

const PlayGround = styled.div`
  background: ${darkTheme.bodyBg};
  width: auto;
  height: calc(100vh - 5rem);
  padding: 1rem;
  font-size: 0.8rem;
  display: flex;
  gap: 1rem;
  overflow: scroll;

  // Hide scrollbar
  -ms-overflow-style: none; /* Edge, Internet Explorer */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

type AddNewType = {
  addNew?: boolean;
}

const Column = styled.div<AddNewType>`
  min-width: 260px;
  max-width: 70vw;
  height: 100%;
  grow: 1;

  ${(props) =>
    props.addNew &&
    css`
      background-color: ${darkTheme.sideBg};
      opacity: 0.4;
      margin-top: 2rem;
      display: flex;
      align-items: center;
    `}
`;

const Dot = styled.h4`
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0 1rem;
  // margin-left: 1rem;
  // position: relative;
  position: sticky;
  top: 0;
  padding-left: 0.8rem;
  color: ${darkTheme.secondaryText};

  background: ${darkTheme.bodyBg};
  opacity: 0.5;
  backdrop-filter: blur(1px);

  &:before {
    content: "";
    position: absolute;
    right: 100%;
    bottom: 50%;
    transform: translateY(50%);
    border-radius: 50%;
    width: 0.8rem;
    height: 0.8rem;
    background: white;
  }
`;

const Card = styled.div<AddNewType>`
  width: 260px;
  line-height: 125%;
  font-weight: 500;
  background: ${darkTheme.sideBg};
  margin: 1rem auto;
  padding: 1.2rem 1rem;
  color: ${darkTheme.primaryText};

  border-radius: 0.8rem;

  min-height: 5rem;
  height: auto;

  ${(props) =>
    props.addNew &&
    css`
      color: ${darkTheme.secondaryText};
      font-size: 1.5rem;
      text-align: center;
    `}
`;

const MainPlayground = () => {
  const [openNewColumn, setOpenNewColumnn] =
    useRecoilState(newColumnModalState);
  const [openNewTask, setOpenNewTask] = useRecoilState(newTaskModalState);
  const [projects, setProjects] = useRecoilState(projectsState);
  const [columns, setColumns] = useRecoilState(columnsState);
  const [selectedBoard, setSelectedBoard] = useRecoilState(selectedState);
  const [showTask, setShowTask] = useRecoilState(selectedTask);
  const [canEditCol, setCanEditCol] = useRecoilState(canEditColumnState);
  const { deleteAndInsert } = useUpdateColumns();
  const hideSideBar = useRecoilValue(hideSideBarState);

  // Menu code
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Drag Effect
  const dragStartHandler = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
    const child = ev.target as HTMLDivElement;
    ev.dataTransfer.setData("cardId", child.dataset.id ?? '');
    ev.dataTransfer.effectAllowed = "move";
  }, []);

  const dropHandler = useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      const data = ev.dataTransfer.getData("cardId");
      const child: HTMLDivElement | null = document.querySelector(`[data-id="${data}"]`);
      const parentNode = ev?.target as HTMLDivElement | null;
      const childParent = child?.parentNode as HTMLDivElement | null;
      // child &&
      // child.parentNode?.dataset?.myId &&
      // parentNode?.appendChild(child);
      if (child && childParent?.dataset?.myId && parentNode?.dataset?.myId) {
        const newColId = parentNode.dataset?.myId;
        const myTask = columns
          .find((col) => col.id === child.dataset?.columnId)
          ?.items?.find((task) => task.id === data);
        if (!myTask) return;
        updateDocument(`tasks/${data}`, { ...myTask, columnId: newColId })
          .then(() => {
            deleteAndInsert(child.dataset.columnId as string, {
              ...myTask,
              columnId: newColId,
            });
            child.dataset.columnId = newColId;
          })
          .catch((err) => console.log("ERROR :---: ", err));
      }
    },
    [columns, deleteAndInsert]
  );

  const dragOverHandler = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }, []);

  // Delete Board
  const handleDeleteBoard = useCallback(() => {
    handleClose();
    if (!selectedBoard?.id) return;
    const references = [`projects/${selectedBoard.id}`];

    // Looping to get all ids
    columns.forEach((column) => {
      column?.items.forEach((task) => {
        references.push(`tasks/${task.id}`);
      });
      references.push(`projects/${column.boardId}/columns/${column.id}`);
    });

    // Making a call
    deleteReferences(references)
      .then((data) => {
        console.log(" Data ", data);
        let newProjects: ProjectsType = [];
        // Removing Deleted Project
        setProjects((oldProjects) => {
          newProjects = oldProjects.filter(
            (oldProject) => selectedBoard.id !== oldProject.id
          );
          return newProjects;
        });

        // Set 1st project as selected project.
        setSelectedBoard(() => (newProjects?.length > 0) ? newProjects[0] : null);

      })
      .catch((error) => console.log("DELETE FAILED :---: ", error));
  }, [columns, selectedBoard, setProjects, setSelectedBoard]);

  // OnBlur in InputField
  const checkAndUpdate = useCallback(
    (newValue: string, columnId: string): void => {
      if (!columnId || !selectedBoard?.id) return;
      if (columns.find((col) => col.id === columnId)?.name !== newValue) {
        updateDocument(`projects/${selectedBoard?.id}/columns/${columnId}`, {
          name: newValue,
        }).then(() => {
          // Change Columns.find(columnId).name = newValue
          setColumns((oldColumns) => {
            const newCols: ColumnsType = [];
            oldColumns.forEach((col) => {
              col.id === columnId
                ? newCols.push({ ...col, name: newValue })
                : newCols.push(col);
            });
            return newCols;
          });
        });
      }
    },
    [columns, selectedBoard?.id, setColumns]
  );

  // Delete Col along with all task
  const deleteCol = useCallback(
    (columnId: string): void => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return;
      const references: string[] = [`projects/${column?.boardId}/columns/${column.id}`];
      column?.items?.forEach((task) => {
        references.push(`tasks/${task.id}`);
      });

      deleteReferences(references)
        .then((res) => {
          setColumns((oldColumns) =>
            oldColumns.filter((col) => col.id !== column.id)
          );
        })
        .catch((error) => console.error("Error deleting COl :---:", error));
    },
    [columns, setColumns]
  );

  return (
    <MainPlayGroundContainer>
      <Heading>
        <h2 style={{ margin: "0" }}>
          {selectedBoard?.name}
        </h2>
        <Options>
          {columns?.length > 0 && (
            <NewTaskButton onClick={() => setOpenNewTask(true)}>
              <AddIcon fontSize="small" />
            </NewTaskButton>
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
            sx={{
              color: darkTheme.primaryText,
            }}
          >
            <MenuItem onClick={handleDeleteBoard}>Delete Board</MenuItem>
            {!!canEditCol ? (
              <MenuItem
                onClick={() => {
                  handleClose();
                  setCanEditCol(false);
                }}
              >
                Edit Done
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  handleClose();
                  setCanEditCol(true);
                }}
              >
                Edit Column
              </MenuItem>
            )}
          </Menu>
        </Options>
      </Heading>
      <PlayGround>
        {/* Previous Columns */}
        {columns?.map((column) => (
          <Column
            key={column.id}
            data-my-id={column.id}
            onDragOver={dragOverHandler}
            onDrop={dropHandler}
          >
            {canEditCol ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Input
                  style={{ padding: "4px", fontSize: ".8rem", border: "none" }}
                  defaultValue={column.name}
                  onBlur={(e) =>
                    checkAndUpdate(e.currentTarget.value || "", column.id)
                  }
                />
                <DeleteIcon
                  style={{ color: "red", fontSize: "1rem", cursor: "pointer" }}
                  onClick={() => deleteCol(column.id)}
                />
              </div>
            ) : (
              <Dot>
                {column.name} ( {column.items?.length ?? 0} )
              </Dot>
            )}
            {column?.items?.map((card) => (
              <Card
                key={card.id}
                onClick={() => setShowTask(card)}
                draggable
                data-id={card.id}
                data-column-id={card.columnId}
                onDragStart={dragStartHandler}
              >
                {card.name}
                <br />
                <p style={{ color: darkTheme.secondaryText }}>
                  {!!card.subTasks.length &&
                    `${doneCount(card.subTasks)} of ${
                      card.subTasks.length
                    } sub-tasks`}
                </p>
              </Card>
            ))}
          </Column>
        ))}
        {/* Add New Column */}
        <Column
          addNew
          onClick={() => !!selectedBoard && setOpenNewColumnn(true)}
        >
          {selectedBoard && <Card addNew>+New Column</Card>}
        </Column>
      </PlayGround>
    </MainPlayGroundContainer>
  );
};

export default MainPlayground;
