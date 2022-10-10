import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import Router from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from "@mui/system";
import GitHubIcon from "@mui/icons-material/GitHub";
import styled, { css } from "styled-components";
import { useMemo } from "react";
import { useCallback } from "react";
import { darkTheme } from "../styles/color";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { LogoBox, Title } from "../components/kanban/SideBar";
import Link from "next/link";
import { selectedState } from "../atoms/selectedAtom";
import { useRecoilState } from "recoil";
import { GetServerSideProps } from "next";

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${darkTheme.sideBg};
  padding: 24px 0;
`;

const SignUpButton = styled.button`
  padding: 12px 24px;
  background: white;
  border: 1px solid black;
  border-radius: 40px;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Switch = styled.label`
  position: relative;
  display: block;
  width: 160px;
  height: 56px;
  margin-left: auto;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + .slider {
    background-color: #2196f3;
  }
  &:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }
  &:checked + .slider .icon {
    -webkit-transform: translateX(104px);
    -ms-transform: translateX(104px);
    transform: translateX(104px);
  }
  &:checked + .slider .log-in {
    display: none;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;

  .icon {
    -webkit-transition: 0.8s;
    transition: 0.8s;
    font-size: 48px;
    position: absolute;
    height: 48px;
    width: 48px;
    left: 4px;
    bottom: 4px;
    color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  border-radius: 34px;
`;

type SignUpTextProps = {
  readonly sliderType: boolean;
  readonly logIn?: boolean;
  readonly logOut?: boolean;
}
const SignUpText = styled.span<SignUpTextProps>`
  ${(props) =>
    props.sliderType &&
    css`
      display: none;
      position: absolute;
      font-weight: 600;
      font-size: 24px;
    `}
  ${(props) =>
    props.logIn &&
    css`
      display: inline-block;
      top: 12px;
      right: 24px;
      color: white;
    `}
      ${(props) =>
    props.logOut &&
    css`
      display: inline-block;
      top: 12px;
      left: 20px;
    `}
`;

const Tools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
`;
const GoToKanban = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
`;
const Tech = styled.a`
  color: ${darkTheme.secondaryText};
  background: ${darkTheme.bodyBg};
  padding: 8px 12px;
  font-size: 1.5rem;
  border-radius: 8px;
`;

export default function Home() {
  const { data: session, status } = useSession();

  const loggedIn = useMemo(() => !!(session && session.user), [session]);
  const [selectedBoard, setSelectedBoard] = useRecoilState(selectedState);

  return (
    <FullScreen>
      <Container
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Header>
          <LogoBox onClick={() => session?.user && Router.push("/kanban")}>
            <ViewColumnIcon fontSize="large" style={{ fontSize: "2.64rem" }} />
            {loggedIn ? (
              <Link href="/kanban">
                <Title>kanban</Title>
              </Link>
            ) : (
              <Title>kanban</Title>
            )}
          </LogoBox>
          {loggedIn ? (
            <Switch>
              <SwitchInput
                type="checkbox"
                checked
                onChange={() => {
                  setSelectedBoard(null);
                  signOut();
                }}
              />
              <Slider className="slider">
                <SignUpText sliderType logOut className="log-out">
                  Log out
                </SignUpText>
                <GitHubIcon className="icon" />
              </Slider>
            </Switch>
          ) : (
            <Switch>
              <SwitchInput type="checkbox" onChange={() => signIn("github")} />
              <Slider className="slider">
                <SignUpText sliderType logIn className="log-in">
                  Sign In
                </SignUpText>
                <GitHubIcon className="icon" />
              </Slider>
            </Switch>
          )}
        </Header>
        <GoToKanban>
          {loggedIn ? (
            <Link href={"/kanban"} passHref>
              <Title style={{ cursor: "pointer" }}>
                <ExitToAppIcon />
                Go to Kanban
              </Title>
            </Link>
          ) : (
            <Title>Welcome To Kanban</Title>
          )}
        </GoToKanban>
        <Tools>
          <Link href="https://nextjs.org/" passHref prefetch={false}>
            <Tech>NextJs</Tech>
          </Link>
          <Link href="https://styled-components.com/" passHref prefetch={false}>
            <Tech>Styled-Component</Tech>
          </Link>
          <Link href="https://firebase.google.com/" passHref prefetch={false}>
            <Tech>Firebase V9</Tech>
          </Link>
          <Link href="https://mui.com/" passHref prefetch={false}>
            <Tech>Material Ui</Tech>
          </Link>
          <Link href="https://recoiljs.org/" passHref prefetch={false}>
            <Tech>Recoil</Tech>
          </Link>
          <Link href="https://next-auth.js.org/" passHref prefetch={false}>
            <Tech>Next Auth</Tech>
          </Link>
        </Tools>
      </Container>
    </FullScreen>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}
