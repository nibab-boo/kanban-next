import styled, { css } from "styled-components";
import { darkTheme } from "../../styles/color";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import LightModeIcon from "@mui/icons-material/LightMode";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Switch from "@mui/material/Switch";
import { useRecoilState, useRecoilValue } from "recoil";
import { newProjectModalState } from "../../atoms/newProjectModalAtom.js";
import { projectsState } from "../../atoms/projectsAtoms";
import { selectedState } from "../../atoms/selectedAtom";
import { useCallback } from "react";

const label = { inputProps: { "aria-label": "Switch Mode" } };

const SideBarContainer = styled.div`
  max-width: 70vw;
  width: 260px;
  height: 100vh;
  background-color: ${darkTheme.sideBg};
  color: ${darkTheme.secondaryText};
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
`;
export const LogoBox = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem 0 0;
  height: 5rem;
  color: ${darkTheme.primaryText};
`;

export const Title = styled.h1`
  margin: 0 0 0 0.6rem;
  font-size: 2rem;
`;

const Boards = styled.div`
  font-size: 0.8rem;
`;

const Text = styled.span``;
const Board = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem;
  margin: 0rem 1rem 0rem -1rem;
  border-radius: 0 26px 26px 0;
  line-height: 125%;
  font-weight: 500;
  cursor: pointer;

  &:first-child {
    margin-top: 2rem;
  }

  ${(props) =>
    props.selected &&
    css`
      background-color: ${darkTheme.buttonBg};
      color: ${darkTheme.primaryText};
    `}
  ${(props) =>
    props.createNew &&
    css`
      color: ${darkTheme.buttonBg};
    `}
`;

const SecondaryTitle = styled.h4`
  margin-top: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SideBarContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SideBarFooter = styled.div`
  font-size: 0.8rem;
`;

const ToogleTheme = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${darkTheme.bodyBg};
  padding: 0.2rem 0;
`;

const ToogleShow = styled.div`
  margin: 0.8rem 0 2.4rem;
  & svg {
    vertical-align: bottom;
  }
`;

const SideBar = () => {
  const [open, setOpen] = useRecoilState(newProjectModalState);
  const projects = useRecoilValue(projectsState);
  const [selectedId, setSelectedId] = useRecoilState(selectedState);

  const onBoardClick = useCallback(
    (project) => {
      if (selectedId && selectedId.id === project.id) return;
      setSelectedId(project);
    },
    [selectedId, setSelectedId]
  );

  return (
    <SideBarContainer>
      <LogoBox>
        <ViewColumnIcon fontSize="large" style={{ fontSize: "2.64rem" }} />
        <Title>kanban</Title>
      </LogoBox>
      <SideBarContent>
        <Boards>
          <SecondaryTitle>All Boards ( {projects.length} )</SecondaryTitle>
          {projects.map((project) => (
            <Board
              key={project.id}
              selected={selectedId && project.id === selectedId?.id}
              onClick={() => onBoardClick(project)}
            >
              <ViewSidebarIcon style={{ marginRight: ".8rem" }} />
              <Text>{project.name}</Text>
            </Board>
          ))}
          <Board createNew onClick={() => setOpen(true)}>
            <ViewSidebarIcon style={{ marginRight: ".8rem" }} />
            <strong>+</strong>
            Create New Board
          </Board>
        </Boards>
        <SideBarFooter>
          <ToogleTheme>
            <LightModeIcon fontSize="small" style={{ fontSize: "medium" }} />
            <Switch {...label} defaultChecked />
            <ModeNightIcon fontSize="small" style={{ fontSize: "medium" }} />
          </ToogleTheme>
          <ToogleShow>
            {true ? (
              <>
                <VisibilityOffIcon fontSize="small" /> Hide Sidebar
              </>
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </ToogleShow>
        </SideBarFooter>
      </SideBarContent>
    </SideBarContainer>
  );
};

export default SideBar;
