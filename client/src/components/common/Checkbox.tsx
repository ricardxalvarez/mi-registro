import { ChangeEvent } from "react"
import styled from "styled-components"

interface CheckboxInterface {
  checked?: boolean
  name?: string
  label?: string
  onChange: Function
}

export default function Checkbox({
  checked,
  name,
  label,
  onChange
}: CheckboxInterface) {
  function onChangeChecked(e: ChangeEvent<HTMLInputElement>) {
    const check = e.target.checked
    onChange(check)
  }
    return (
        <Main>
          <input onChange={onChangeChecked} checked={checked} name={name} type="checkbox"/>
          <label className="terms-label">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" className="checkbox-svg">
              <mask fill="white">
                <rect height="200" width="200"></rect>
              </mask>
              <rect mask="url(#path-1-inside-1_476_5-37)" strokeWidth="30" className="checkbox-box" height="200" width="200"></rect>
              <path strokeWidth="15" d="M52 111.018L76.9867 136L149 64" className="checkbox-tick"></path>
            </svg>
            {
              label &&
              <span className="label-text">{label}</span>
            }
          </label>
        </Main>
    )
}

const Main = styled.div`
flex: 0;
position: relative;
input[type="checkbox"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  opacity: 0;
  cursor: pointer;
}

.terms-label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.terms-label .label-text {
  margin-left: 10px;
  font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.gray.GunmetalGray};
}

.checkbox-svg {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid ${props => props.theme.blue.Denim};
}

 .checkbox-box {
    border-radius: 15px;
  fill: ${props => props.theme.gray.Platinum};
  stroke: ${props => props.theme.blue.Denim};
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  transition: stroke-dashoffset 0.3s ease-in;
}

.checkbox-tick {
  stroke: ${props => props.theme.blue.Denim};
  stroke-dasharray: 172;
  stroke-dashoffset: 172;
  transition: stroke-dashoffset 0.3s ease-in;
}

input[type="checkbox"]:checked + .terms-label .checkbox-box,
  input[type="checkbox"]:checked + .terms-label .checkbox-tick {
  stroke-dashoffset: 0;
}

`