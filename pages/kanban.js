import Head from "next/head";
import styled from "styled-components"
import MainPlayground from "../components/kanban/MainPlayground";
import SideBar from "../components/kanban/SideBar";
import { Modal, Box, Typography } from "@mui/material";
import { modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";

const Container = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  widht: 100vw;
  max-width: 100vw;
`
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const Kanban = () => {
  const [open, setOpen] = useRecoilState(modalState);
  const { data: session } = useSession();
  console.log("SESSION", session);

  return (
    <Container>
      <Head>
        <title>
          My Kanban
        </title>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Container>
  )

}

export default Kanban;