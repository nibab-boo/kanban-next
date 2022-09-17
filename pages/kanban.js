import Head from "next/head";
import styled from "styled-components";
import MainPlayground from "../components/kanban/MainPlayground";
import SideBar from "../components/kanban/SideBar";
import { darkTheme } from "../styles/color";
import { Modal, Box, Typography } from "@mui/material";
import { Button } from "../components/common/Button";
import { modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import InputField from "../components/common/InputField";
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
import { db } from "../core/firebase";
import { selectedState } from "../atoms/selectedAtom";
import Router from "next/router";
import { useCallback } from "react";
import { useEffect } from "react";
import { projectsState } from "../atoms/projectsAtoms";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

const Container = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  widht: 100vw;
  max-width: 100vw;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: darkTheme.sideBg,
  color: darkTheme.primaryText,
  borderColor: darkTheme.sideBg,
  boxShadow: 24,
  borderRadius: "8px",
  p: 3,
};

const Kanban = () => {
  const [open, setOpen] = useRecoilState(modalState);
  const [selectedId, setSelectedId] = useRecoilState(selectedState);
  const [projects, setProjects] = useRecoilState(projectsState);
  const { data: session, status } = useSession();
  const [keyword, setKeyword] = useState("");

  
  
  const fetchSong = useCallback(async () => {
    const q = query(
      collection(db, "projects"),
      where("user_id", "==", session?.user?.id ?? "")
    );

    const projectSnapshot = await getDocs(q);

    const allProjects = []

    projectSnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      allProjects.push({
        id: doc.id,
        ...(doc.data())
      })
    });

    allProjects.sort((a, b) => {
      const firstTime = a?.timestamp?.seconds;
      const secondTime = b?.timestamp?.seconds;

      if (firstTime > secondTime) return 1;
      if (firstTime < secondTime) return -1;
      return 0;
    })
    setProjects(allProjects ?? []);
  }, [session, setProjects]);
  

  
  const createProject = useCallback(async () => {
    if (!keyword && !session?.user?.id) return;
    
    try {
      const response = await addDoc(collection(db, "projects"), {
        name: keyword,
        user_id: session.user.id,
        timestamp: serverTimestamp(),
      });
      setSelectedId(response.id || selectedId);
    } catch (error) {
      console.error("ERROR", error);
    }
  }, [keyword, selectedId, session, setSelectedId]);
 
  useEffect(() => {
    console.log("session?.user?.id", session?.user?.id);
    fetchSong();
  }, [fetchSong, session]);
  
  if (status === "loading") return <p>Loading.....</p>

  if (status === "unauthenticated") Router.push("/");
  
  return (
    <Container>
      <Head>
        <title>My Kanban</title>
        <meta name="description" content="Kanban playground" />
      </Head>
      <SideBar />
      <MainPlayground />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ fontWeight: "600" }}
          >
            Add New Board
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <InputField
              name="board_name"
              label="Board Name"
              placeholder="eg. Web Design"
              onChange={(e) => setKeyword(e?.target?.value ?? "")}
            />
            <Button fullSize margin="2rem auto 0" onClick={createProject}>
              Create New Task
            </Button>
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default Kanban;
