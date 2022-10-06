import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { darkTheme } from '../../styles/color';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from '../common/Button';
import { useRecoilState, useRecoilValue } from 'recoil';
import { newColumnModalState } from '../../atoms/newColumnModalAtom';
import { columnsState } from '../../atoms/columnsAtom';
import { newTaskModalState } from '../../atoms/newTaskModalAtom';
import { selectedState } from '../../atoms/selectedAtom';
import { selectedTask } from '../../atoms/selectedTask';
import { doneCount } from '../../services/doneCount';

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

const Options = styled.div`
  svg {
    vertical-align: middle;
  }
`

const PlayGround = styled.div`
  background: ${darkTheme.bodyBg};
  width: auto;
  height: calc(100vh - 5rem);
  // overflow: hidden;
  padding: 1rem;
  font-size: .8rem;
  display: flex;
  gap: 1rem;
  overflow: scroll;

  // Hide scrollbar
  -ms-overflow-style: none; /* Edge, Internet Explorer */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

const Column = styled.div`
  width: 260px; 
  max-width: 70vw;
  height: 100%;
  grow: 1;
  
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
  // position: relative;
  position: sticky;
  top: 0;
  padding-left: .8rem;
  color: ${darkTheme.secondaryText};
  
  background: ${darkTheme.bodyBg};
  opacity: .5;
  backdrop-filter: blur(1px);
  
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
  width: 260px; 
  line-height: 125%;
  font-weight: 500;
  background: ${darkTheme.sideBg};
  margin: 1rem auto;
  padding: 1.2rem 1rem;
  color: ${darkTheme.primaryText};

  border-radius: .8rem;

  min-height: 5rem;
  height: auto;

  ${props => props.addNew && css`
    color: ${darkTheme.secondaryText};
    font-size: 1.5rem;
    text-align: center;
  `}
`


const MainPlayground = () => {
  const [openNewColumn, setOpenNewColumnn] = useRecoilState(newColumnModalState);
  const [openNewTask, setOpenNewTask] = useRecoilState(newTaskModalState);
  const columns = useRecoilValue(columnsState);
  const selectedBoard = useRecoilValue(selectedState);
  const [showTask, setShowTask] = useRecoilState(selectedTask);

  return (
    <MainPlayGroundContainer>
      <Heading>
        <h2 style={{margin: "0"}}>{selectedBoard?.name ?? "selected/create a board"}</h2>
        <Options>
          {columns.length > 0 && 
            <Button onClick={() => setOpenNewTask(true)}>+Add New Task</Button>
          }
          <MoreVertIcon />
        </Options>
      </Heading>
      <PlayGround>
        {/* Previous Columns */}
        {
          columns.map(column => (
          <Column
            key={column.id}          >
            <Dot>{column.name} ( {column.items?.length ?? 0} )</Dot>
            {column.items.map((card) => 
            (<Card key={card.id} 
              onClick={() => setShowTask(card)}
            >
              {card.name}
              <br />
              <p style={{color: darkTheme.secondaryText}}>
                {!!card.subTasks.length && `${doneCount(card.subTasks)} of ${card.subTasks.length} sub-tasks`}
              </p>
            </Card>))}
          </Column>
          ))
        }
        {/* Add New Column */}
        <Column
          addNew
          onClick={() => setOpenNewColumnn(true)}
        >
          <Card addNew>
            +New Column
          </Card>
        </Column>
      </PlayGround>
    </MainPlayGroundContainer>
  );
};

export default MainPlayground;