import Head from "next/head";
import styled from "styled-components";
import MainPlayground from "../components/kanban/MainPlayground";
import SideBar from "../components/kanban/SideBar";
import { newProjectModalState } from "../atoms/newProjectModalAtom.js";
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

const Container = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
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
  const { data: session, status } = useSession();
  const [keyword, setKeyword] = useState("");
  const [columnName, setColumnName] = useState("");

  const fetchProjects = useCallback(async () => {
    const q = query(
      collection(db, "projects"),
      where("userId", "==", session?.user?.id ?? "")
    );

    const projectSnapshot = await getDocs(q);

    const allProjects = [];

    projectSnapshot.forEach((doc) => {
      allProjects.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    allProjects.sort((a, b) => {
      const firstTime = a?.timestamp?.seconds;
      const secondTime = b?.timestamp?.seconds;

      if (firstTime > secondTime) return 1;
      if (firstTime < secondTime) return -1;
      return 0;
    });

    setProjects(allProjects ?? []);
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
        setColumns(data.data || [])})
      .catch(error => console.log("ERROR", error));

  }, [selectedId, setColumns]);

  const createColumn = useCallback(async () => {
    if (!columnName || !session?.user?.id || !selectedId.id) return;
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
      const newCol = {
        id: response.id,
        name: columnName,
        userId: session?.user?.id,
        boardId: selectedId?.id,
        timestamp: { seconds: dateTime.getTime() / 1000},
      }
      setColumns([...columns, newCol]);
    } catch (error) {
      console.log("ERROR", error);
    }

    setOpenNewColumn(false);
  }, [columnName, selectedId, session, setOpenNewColumn, columns, setColumns]);

  useEffect(() => {
    console.log("session?.user?.id", session?.user?.id);
    fetchProjects();
  }, [fetchProjects, session]);

  if (status === "loading") return <p>Loading.....</p>;

  if (status === "unauthenticated") Router.push("/");

  return (
    <Container>
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
      <NewTaskModal />
    </Container>
  );
};

export default Kanban;
