import styled, { css } from 'styled-components';
import { darkTheme } from '../../styles/color';

export const InputContainer = styled.div`
  ${props => props.margin && `
    margin: ${props.margin};
  `}
  `;
  
export const Label = styled.label`
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
  ${props => props.margin && `
    margin: ${props.margin}
  `}
`

const InputField = ({
  containerMargin = "2rem auto 0",
  labelSize = "0.9rem",
  block="inline-block",
  name="input",
  label,
  placeholder="",
  inputMargin = "0",
  ...props
}) => {
  return (
    <InputContainer margin={containerMargin}>
      {label && <Label htmlFor={name} labelSize={labelSize} block={block}>
        {label}
      </Label>}
      <Input 
        name={name}
        placeholder={placeholder}
        inputMargin={inputMargin}
        {...props}
      />
    </InputContainer>
  );
};

export default InputField;