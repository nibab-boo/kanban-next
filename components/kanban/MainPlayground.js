import React from 'react';
import styled, { css } from 'styled-components';
import { darkTheme } from '../../styles/color';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MainPlayGroundContainer = styled.div`
  width: 100%;
  overflow: hidden;
`

const Heading = styled.div`
  background: ${darkTheme.sideBg};
  color: ${darkTheme.primaryText};
  height: 5rem;
  display: flex;
  padding: 0 1.2rem;
  align-items: center;
  justify-content: space-between;
`

const NewTaskButton = styled.div`
  background: ${darkTheme.buttonBg};
  padding: .8rem 1.2rem;
  display: inline-block;
  border-radius: 28px;
  font-weight: 500;
  `
  
  const Options = styled.div`
  svg {
    vertical-align: middle;
  }
`

const PlayGround = styled.div`
  background: ${darkTheme.bodyBg};
  width: auto;
  height: calc(100vh - 5rem);
  overflow: hidden;
  padding: 1rem;
  font-size: .8rem;
  display: flex;
  gap: 1rem;
`

const Column = styled.div`
  width: 260px; 
  max-width: 70vw;
  height: auto;

  ${props => props.addNew && css`
    background-color: ${darkTheme.sideBg};
    opacity: .4;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    `
  }
`

const Dot = styled.h4`
  text-transform: uppercase;
  letter-spacing: .5px;
  margin: 0 0 0 1rem;
  // margin-left: 1rem;
  position: relative;
  padding-left: .8rem;
  color: ${darkTheme.secondaryText};
  
  &:before {
    content: "";
    position: absolute;
    right: 100%;
    bottom: 50%;
    transform: translateY(50%);
    border-radius: 50%;
    width: .8rem;
    height: .8rem;
    background: white;
  }
`

const Card = styled.div`
  line-height: 125%;
  font-weight: 500;
  background: ${darkTheme.sideBg};
  margin: 1rem auto;
  padding: 1.5rem 1rem;
  color: ${darkTheme.primaryText};

  border-radius: .8rem;

  min-height: 5rem;
  height: auto;

  ${props => props.addNew && css`
    color: ${darkTheme.secondaryText};
    font-size: 1.5rem;
    margin: auto;
  `}
`


const MainPlayground = () => {
  return (
    <MainPlayGroundContainer>
      <Heading>
        <h2 style={{margin: "0"}}>Daily Plans</h2>
        <Options>
          <NewTaskButton>+Add New Task</NewTaskButton>
          <MoreVertIcon />
        </Options>
      </Heading>
      <PlayGround>
        <Column>
          <Dot>TODO ( 4 )</Dot>
          <Card>
            Build UI for onboarding flow
          </Card>
          <Card>
            Build UI for search
          </Card>
          <Card>
            Build settings UI
          </Card>
          <Card>
            QA and test all major user journeys
          </Card>
        </Column>

        <Column>
          <Dot>DOING ( 6 )</Dot>
          <Card>
            Design settings and search pages
          </Card>
          <Card>
            Design onboarding flow
          </Card>
          <Card>
            Add search endpoints
          </Card>
          <Card>
            Research pricing points of various competitors and trial different business models
          </Card>
        </Column>

        <Column>
          <Dot>DOING ( 6 )</Dot>
          <Card>
            Design settings and search pages
          </Card>
          <Card>
            Design onboarding flow
          </Card>
          <Card>
            Add search endpoints
          </Card>
          <Card>
            Research pricing points of various competitors and trial different business models
          </Card>
        </Column>

        {/* Add New Column */}
        <Column addNew>
          <Card addNew>
            +New Column
          </Card>
        </Column>
      </PlayGround>
    </MainPlayGroundContainer>
  );
};

export default MainPlayground;