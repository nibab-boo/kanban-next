import styled, { css } from 'styled-components';
import { darkTheme } from '../../styles/color';


type InputContainerType = {
  margin?: string;
}

type LabelType = {
  labelSize?: string;
  block?: string;
}

type InputType = {
  margin?: string;
  width?: string;
}

export const InputContainer = styled.div<InputContainerType>`
  ${props => props.margin && `
    margin: ${props.margin};
  `}
  `;
  
export const Label = styled.label<LabelType>`
  margin-bottom: .9rem;
  font-size: .9rem;
  ${props => props.labelSize && `
    font-size: ${props.labelSize};
  `}
  ${props => props.block && `
    display: ${props.block};
  `}
`;

export const Input = styled.input<InputType>`
  padding: 10px;
  border: 2px solid ${darkTheme.secondaryText};
  font-weight: 500;
  border-radius: 4px;
  color: ${darkTheme.primaryText};
  background: ${darkTheme.sideBg};
  width: 100%;
  font-size: 1rem;
  ${props => `
    margin: ${props.margin ?? 0};
  `}
  ${props => props.width && `
    width: ${props.width};
  `}
`

interface InputFieldProps extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  containerMargin?: string;
  labelSize?: string;
  block?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  inputMargin?: string;
  inputWidth?: string;
  style: any;
}

const InputField = ({
  containerMargin = "2rem auto 0",
  labelSize = "0.9rem",
  block="inline-block",
  name="input",
  label,
  placeholder="",
  onChange,
  inputWidth,
  style,
}: InputFieldProps) => {
  return (
    <InputContainer margin={containerMargin} style={style}>
      {label && <Label htmlFor={name} labelSize={labelSize} block={block}>
        {label}
      </Label>}
      <Input
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        width={inputWidth}
      />
    </InputContainer>
  );
};

export default InputField;