import Head from "next/head";
import styled from "styled-components";
import MainPlayground from "../components/kanban/MainPlayground";
import SideBar from "../components/kanban/SideBar";
import { newProjectModalState } from "../atoms/newProjectModalAtom";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
} from "firebase/firestore";
import { db } from "../core/firebase";
import { selectedState } from "../atoms/selectedAtom";
import Router from "next/router";
import { useCallback } from "react";
import { useEffect } from "react";
import { projectsState } from "../atoms/projectsAtoms";
import { newColumnModalState } from "../atoms/newColumnModalAtom";
import AddModal from "../components/common/AddModal/AddModal";
import { columnsState } from "../atoms/columnsAtom";
import NewTaskModal from "../components/common/NewTaskModal/NewTaskModal";
import ShowModal from "../components/common/ShowModal/ShowModal";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { ProjectsType, ProjectType } from "../types/project";
import { ColumnType } from "../types/column";
import { GetServerSideProps } from "next";

const KanbanContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: auto;
  widht: 100vw;
  max-width: 100vw;
`;

const Kanban = () => {
  const [openNewProject, setOpenNewProject] =
    useRecoilState(newProjectModalState);
  const [openNewColumn, setOpenNewColumn] = useRecoilState(newColumnModalState);
  const [selectedId, setSelectedId] = useRecoilState(selectedState);
  const [projects, setProjects] = useRecoilState(projectsState);
  const [columns, setColumns] = useRecoilState(columnsState);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      Router.push("/");
    },
  })
  const [keyword, setKeyword] = useState<string>("");
  const [columnName, setColumnName] = useState<string>("");

  const fetchProjects = useCallback(async () => {
    const q = query(
      collection(db, "projects"),
      where("userId", "==", session?.user?.id ?? "")
    );


    const projectSnapshot = await getDocs(q);

    const allProjects: ProjectsType = [];

    projectSnapshot.forEach((doc) => {
      allProjects.push({
        id: doc.id,
        ...doc.data(),
      } as ProjectType);
    });

    allProjects.sort((a, b) => {
      const firstTime = a?.timestamp?.seconds;
      const secondTime = b?.timestamp?.seconds;

      if (firstTime > secondTime) return 1;
      if (firstTime < secondTime) return -1;
      return 0;
    });

    setProjects(allProjects);
  }, [session, setProjects]);



  const createProject = useCallback(async () => {
    if (!keyword || !session?.user?.id) return;
    try {
      const response = await addDoc(collection(db, "projects"), {
        name: keyword,
        userId: session.user.id,
        timestamp: serverTimestamp(),
      });
      const dateTime = new Date();
      const newProject = {
        id: response.id,
        name: keyword,
        userId: session.user.id,
        timestamp: { seconds: dateTime.getTime() / 1000}
      };

      setProjects(() => [...projects, newProject]);
      setSelectedId(newProject ?? selectedId);
    } catch (error) {
      console.error("ERROR", error);
    }
    setOpenNewProject(false); 
  }, [
    keyword,
    selectedId,
    session,
    setOpenNewProject,
    setSelectedId,
    projects,
    setProjects,
  ]);


  // Need to move it into MainPlayground
  useEffect(() => {
    if (!selectedId || !selectedId.id) return;
    fetch("/api/boards/" + selectedId.id)
      .then(res => res.json())
      .then(data => {
        console.log("Columns :---: ", data);
        setColumns(data.data || [])})
      .catch(error => console.log("ERROR", error));

  }, [selectedId, setColumns]);

  const createColumn = useCallback(async () => {
    console.log({columnName, session: session?.user?.id, selectedId: selectedId?.id });
    if (!columnName || !session?.user?.id || !selectedId?.id) return;
    try {
      const response = await addDoc(
        collection(doc(db, "projects", selectedId.id), "columns"),
        {
          name: columnName,
          userId: session.user.id,
          boardId: selectedId.id,
          timestamp: serverTimestamp(),
        }
      );
      const dateTime = new Date();
      const newCol: ColumnType = {
        id: response.id,
        name: columnName,
        userId: session?.user?.id,
        boardId: selectedId?.id,
        items: [],
        timestamp: { seconds: dateTime.getTime() / 1000},
      }
      setColumns([...columns, newCol]);
    } catch (error) {
      console.log("ERROR", error);
    }

    setOpenNewColumn(false);
  }, [columnName, selectedId, session, setOpenNewColumn, columns, setColumns]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, session]);

  return (
    <KanbanContainer>
      <Head>
        <title>My Kanban</title>
        <meta name="description" content="Kanban playground" />
      </Head>
      {/* SIDEBAR */}
      <SideBar />
      {/* MAINPLAYGROUND */}
      <MainPlayground/>
      <AddModal 
        title="Add New Board"
        ButtonText="Create New Board"
        action={createProject}
        setKeyword={setKeyword}
        openStatus={openNewProject}
        onClose={() => setOpenNewProject(false)}
      />
      <AddModal 
        title="Add New Column"
        ButtonText="Create New Column"
        action={createColumn}
        setKeyword={setColumnName}
        openStatus={openNewColumn}
        onClose={() => setOpenNewColumn(false)}
      />
      <ShowModal />
      <NewTaskModal />
    </KanbanContainer>
  );
};

export default Kanban;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}