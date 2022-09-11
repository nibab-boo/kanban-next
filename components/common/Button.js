import styled, { css } from 'styled-components';
import { darkTheme } from '../../styles/color';
export const Button = styled.button`
  background: ${darkTheme.buttonBg};
  // color: ${darkTheme.primaryText};
  color: white;
  padding: .8rem 1.2rem;
  display: inline-block;
  border: 0;
  border-radius: 28px;
  font-weight: 600;
  font-size: .9rem;
  cursor: pointer;
  
  ${props => props.fullSize && `
     display: block;
     width: 100%;
     text-align: center;
   `}

    ${props => props.margin && `
      margin: ${props.margin}
    `}
   `