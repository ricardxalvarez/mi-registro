import styled from "styled-components";
import GeneralInput from "./GeneralInput";
import { IoIosClose } from "react-icons/io";
import React, { CSSProperties } from "react";
import { ChangeEvent } from "react";
import Select from "./Select";
import isNumeric from "../../utils/isNumeric";
import findHighestIdx from "../../utils/findHighestIdx";

interface ListInterface {
    list: Array<any>,
    onChange?: Function,
    type?: string
    placeholder?: string
    label?: string
    min?: number
    max?: number
    required?: boolean,
    maxLength?: number
    options?: Array<any>
    defaultNull?: boolean,
    isText?: boolean
}

export default function ListInput({
    list,
    options,
    onChange,
    label,
    placeholder,
    min,
    max,
    required,
    type,
    defaultNull,
    isText
}: ListInterface) {
    const parsedList = list.map((value, index) => {
        return ({value, idx: index})
    })

    function onChangeTyping(e: ChangeEvent<HTMLInputElement>, idx: number) {
        let value: string | number = e.target.value
        if (!isText && isNumeric(value)) value = Number(value)
        const currentElement = parsedList.find(item => item.idx === idx)
        const filteredList = parsedList.filter(item => item.idx !== idx)
        const newItem = {...currentElement, value}
        const newList = [...filteredList, newItem ].sort((a: any, b: any) => a.idx - b.idx)
        onChange &&
        onChange(newList.map(item => item.value))
    }

    function onChangeSelect(e: ChangeEvent<HTMLSelectElement>, idx: number) {
        let value: string | number = e.target.value
        if ( isNumeric(value)) value = Number(value)
        const currentElement = parsedList.find(item => item.idx === idx)
        const filteredList = parsedList.filter(item => item.idx !== idx)
        const newItem = {...currentElement, value}
        const newList = [...filteredList, newItem ].sort((a: any, b: any) => a.idx - b.idx)
        onChange &&
        onChange(newList.map(item => item.value))
    }
    
    function add() {
        onChange &&
        onChange([...list, null])
    }

    function deleteObj(idx: number) {
        const filteredList = parsedList.filter(item => item.idx !== idx).map(item => item.value)
        onChange &&
        onChange(filteredList)
    }

    return (
        <Main>
            {
                label &&
                <label>{label}</label>
            }
            <List>
                    {
                        parsedList.map((item: any) => {
                            return (
                            <div className="input" key={item.idx}>
                                <div className="delete"
                                onClick={() => deleteObj(item.idx)}
                                >
                                    <IoIosClose/>
                                </div>
                                {
                                    options ?
                                    <Select
                                    options={options}
                                    value={item.value}
                                    onChange={e => onChangeSelect(e, item.idx)}
                                    required={required}
                                    defaultNull={defaultNull}
                                    />
                                    :
                                    <GeneralInput
                                    value={item.value}
                                    type={type}
                                    placeholder={placeholder}
                                    required={required}
                                    min={min}
                                    max={max}
                                    onChange={e => onChangeTyping(e, item.idx)}
                                    />
                                }
                            </div>
                            )
                        })
                    }
                <button className="add"
                onClick={add}
                type="button"
                >
                    +
                </button>
            </List>
        </Main>
    )
}

const Main = styled.div`
> label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.gray.GunmetalGray};
}
`

const List = styled.div`
display: flex;
flex-direction: column;
gap: 20px;
align-items: center;
.add {
    margin: auto;
 padding: 0.8em 1.8em;
 width: 50%;
 border: 2px solid ${props => props.theme.blue.Denim};
 position: relative;
 overflow: hidden;
 background-color: transparent;
 text-align: center;
 text-transform: uppercase;
 font-size: 16px;
 transition: .3s;
 cursor: pointer;
 border-radius: 10px;
 z-index: 1;
 font-family: inherit;
 color: ${props => props.theme.blue.Denim};
 float: right;
}
.add::before {
 content: '';
 width: 0;
 height: 350%;
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%) rotate(45deg);
 background: ${props => props.theme.blue.Denim};
 transition: .5s ease;
 display: block;
 z-index: -1;
}

.add:hover::before {
 width: 130%;
}

.add:hover {
 color: ${props => props.theme.white.White};
}

.input {
    width: 100%;
    position: relative;
    .delete {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: -20px;
        font-size: 18px;
    }
}


`