import { CSSProperties, ChangeEvent } from "react";
import styled from "styled-components";

interface Option {
    value: string | number,
    name: string
}

interface SelectInterface {
    label?: string
    options: Option[]
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => any,
    name?: string
    value?: string | number
    defaultNull?: boolean,
    required?: boolean
    style?: CSSProperties
}

export default function Select({
    label,
    options,
    onChange,
    name,
    value,
    defaultNull,
    required,
    style
}: SelectInterface) {
    return (
        <Main style={style}>
            {
                label &&
                <label>{label}</label>
            }
            <select required={required}  name={name} value={value} onChange={onChange}>
                {
                    defaultNull &&
                    <option disabled selected> -- </option>                }
                {
                    options.map((obj, idx) => {
                        return <option key={idx} value={obj.value}>{obj.name}</option>
                    })
                }
            </select>
        </Main>
    )
}

const Main = styled.div`
display: flex;
flex-direction: column;
gap: 5px;
flex: 1;
label {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.gray.GunmetalGray};
}
select {
    flex: 1;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 90%;
    background-position-y: 50%;
    border: 1px solid ${props => props.theme.gray.Smoke};
    border-radius: 10px;
    width: 100%;
    margin-right: 2rem;
    padding: 10px 15px;
    padding-right: 2rem;
    outline: none;
}
`