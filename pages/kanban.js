import Head from "next/head";
import styled from "styled-components"
import MainPlayground from "../components/kanban/MainPlayground";
import SideBar from "../components/kanban/SideBar";

const Container = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  widht: 100vw;
  max-width: 100vw;
`


const Kanban = () => {

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
    </Container>
  )

}

export default Kanban;