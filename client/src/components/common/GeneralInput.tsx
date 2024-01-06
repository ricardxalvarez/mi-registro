import { CSSProperties, ChangeEvent } from "react";
import styled, { css } from "styled-components";

interface GeneralInputInterface {
    value?: string | number,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => any,
    image?: any,
    style?: CSSProperties,
    type?: string
    placeholder?: string
    label?: string
    name?: string
    min?: number
    max?: number
    required?: boolean,
    lightMode?: boolean
    maxLength?: number
}

export default function GeneralInput({
    value,
    onChange,
    image,
    placeholder,
    type,
    style,
    label,
    name,
    min,
    max,
    required,
    lightMode,
    maxLength
}: GeneralInputInterface) {
    function typing(e: ChangeEvent<HTMLInputElement>) {
        // console.log(e.target.value)
        if (maxLength) {
            if (e.target.value.length > maxLength) {
                return e.preventDefault()
            }
        }
        if (onChange)
        return onChange(e)
    }
    return (
        <Main light={lightMode} style={style}>
            {
                label &&
                <label>{label}</label>
            }
            <div className="input">
                {
                    maxLength &&
                    <span className="max-length">{value ? value.toLocaleString().length : 0}/{maxLength}</span>
                }
            {
                image &&
                <img src={image} alt=""/>
            }
                <input 
                name={name} 
                placeholder={placeholder} 
                type={type || 'text'} 
                value={value} 
                min={min}
                max={max}
                required={required}
                onChange={typing}/>
            </div>
        </Main>
    )
}

const Main = styled.div<{light?: boolean}>`
display: flex;
flex-direction: column;
gap: 5px;
label {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.gray.GunmetalGray};
    ${props => props.light === true && css`
        color: ${props => props.theme.white.OffWhite};
    `}
}
.input {
    min-width: 0;
    border-radius: 8px;
    height: 50px;
    padding: 20px 20px;
    display: flex;
    gap: 10px;
    align-items: center;
    width: calc(100% - 10px);
    position: relative;
    background-color: ${props => props.theme.white.White};
    border: 1px solid ${props => props.theme.dark.Charcoal};
    ${props => props.light === true && css`
        border: 1px solid ${props => props.theme.gray.Pewter};
    `}
    .max-length {
        position: absolute;
        bottom: -17px;
        font-size: 11px;
        right: 0;
    }
    input {
        flex: 1;
        font-size: 16px;
        border: none;
        outline: none;
        min-width: 0;
        background-color: ${props => props.theme.white.White};
        &::placeholder {
            color: ${props => props.theme.gray.Pewter};
        }
    }
}
`