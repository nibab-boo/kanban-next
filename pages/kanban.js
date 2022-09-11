import Head from "next/head";
import styled from "styled-components"
import MainPlayground from "../components/kanban/MainPlayground";
import SideBar from "../components/kanban/SideBar";
import { darkTheme } from "../styles/color";
import { Modal, Box, Typography } from "@mui/material";
import { Button } from "../components/common/Button";
import { modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import InputField from "../components/common/InputField";

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
  bgcolor: darkTheme.sideBg,
  color: darkTheme.primaryText,
  borderColor: darkTheme.sideBg,
  boxShadow: 24,
  borderRadius: "8px",
  p: 3,
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
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{fontWeight: "600"}}>
            Add New Board
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <InputField
              name="board_name"
              label="Board Name"
              placeholder="eg. Web Design"
            />
            <Button fullSize margin="2rem auto 0">
              Create New Task
            </Button>
          </Typography>
        </Box>
      </Modal>
    </Container>
  )

}

export default Kanban;