import styled, { css } from "styled-components";
import { darkTheme } from "../../styles/color";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRecoilState, useRecoilValue } from "recoil";
import { newProjectModalState } from "../../atoms/newProjectModalAtom.js";
import { projectsState } from "../../atoms/projectsAtoms";
import { selectedState } from "../../atoms/selectedAtom";
import { useCallback } from "react";
import { Avatar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { hideSideBarState } from "../../atoms/hideSideBar";

const label = { inputProps: { "aria-label": "Switch Mode" } };

const LogOutButton = styled.button`
  padding: 12px 24px;
  background: ${darkTheme.sideBg};
  border: 0px solid black;
  border-radius: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  color: ${darkTheme.secondaryText}
  transition: .6s;
  &:hover {
    background: ${darkTheme.secondaryText};
    color: ${darkTheme.primaryText};
  }
  `;

const SideBarContainer = styled.div`
  max-width: 70vw;
  height: 100vh;
  background-color: ${darkTheme.sideBg};
  color: ${darkTheme.secondaryText};
  padding: 0 1rem;
  display: flex;
  width: 260px;
  flex-direction: column;
  ${(props) =>
    props.autoWidth &&
    css`
      width: auto;
    `}
`;
export const LogoBox = styled.a`
  display: flex;
  align-items: flex-start;
  padding: 1rem 0 0;
  height: 5rem;
  color: ${darkTheme.primaryText};
  cursor: normal;
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

const UserInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${darkTheme.bodyBg};
  padding: 0.2rem;
  border-radius: 24px;
`;

const ToogleShow = styled.div`
  background: ${darkTheme.bodyBg};
  padding: 4px;
  display: inline-block;
  border-radius: 8px;
  cursor: pointer;
  margin: 0.6rem auto 2rem;
  & svg {
    vertical-align: middle;
  }
  &::after {
    content: "  Hide SideBar";
    white-space: pre;
    transition: 1s;
  }
  &:hover::after {
    content: "";
  }
`;

const SideBar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(newProjectModalState);
  const projects = useRecoilValue(projectsState);
  const [selectedId, setSelectedId] = useRecoilState(selectedState);
  const [hideSideBar, setHideSideBar] = useRecoilState(hideSideBarState);

  const onBoardClick = useCallback(
    (project) => {
      if (selectedId && selectedId.id === project.id) return;
      setSelectedId(project);
    },
    [selectedId, setSelectedId]
  );

  return (
    <SideBarContainer autoWidth={!!hideSideBar}>
      {!hideSideBar ? (
        <>
          <Link href="/" passHref>
            <LogoBox>
              <ViewColumnIcon
                fontSize="large"
                style={{ fontSize: "2.64rem" }}
              />
              <Title>kanban</Title>
            </LogoBox>
          </Link>
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
              <UserInfoBox>
                <Avatar
                  alt={session?.user?.name ?? session?.user?.email}
                  src={session?.user?.image}
                />
                <LogOutButton onClick={() => signOut()}>Log Out</LogOutButton>
              </UserInfoBox>
              <ToogleShow onClick={() => setHideSideBar(true)}>
                <VisibilityOffIcon fontSize="small" />
              </ToogleShow>
            </SideBarFooter>
          </SideBarContent>
        </>
      ) : (
        <>
          <Link href="/" passHref>
            <ViewColumnIcon
              fontSize="small"
              style={{ margin: "1rem 0 auto"}}
            />
          </Link>
          <VisibilityIcon fontSize="small" style={{ margin: "auto 0 1rem" }} onClick={() => setHideSideBar(false)}/>
        </>
      )}
    </SideBarContainer>
  );
};

export default SideBar;
