import styled, { css } from 'styled-components';
import { darkTheme } from '../../styles/color';

const InputContainer = styled.div`
  ${props => props.margin && `
    margin: ${props.margin};
  `}
  `;
  
const Label = styled.label`
  margin-bottom: .9rem;
  font-size: .9rem;
  ${props => props.fontSize && `
    font-size: ${props.fontSize};
  `}
  ${props => props.block && `
    display: ${props.block};
  `}
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid ${darkTheme.secondaryText};
  font-weight: 500;
  border-radius: 4px;
  color: ${darkTheme.primaryText};
  background: ${darkTheme.sideBg};
  width: 100%;
  font-size: 1rem;
`

const InputField = ({
  containerMargin = "2rem auto 0",
  labelSize = "0.9rem",
  block="inline-block",
  name="input",
  label,
  placeholder="",
}) => {
  return (
    <InputContainer margin={containerMargin}>
      <Label htmlFor={name} labelSize={labelSize} block={block}>
        {label}
      </Label>
      <Input 
        name={name}
        placeholder={placeholder}
      />
    </InputContainer>
  );
};

export default InputField;