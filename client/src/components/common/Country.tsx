import styled from "styled-components";
import { ChangeEvent } from "react";
import countries from '../../json/countries.json'
import CountryCode from "../../types/country";

interface CountryInputInterface {
    value?: CountryCode,
    name?: string,
    onChange?: (e: ChangeEvent<HTMLSelectElement & HTMLInputElement>) => any,
    style?: Object,
    label?: string
}

export default function CountryInput({value, onChange, name, style, label}: CountryInputInterface) {
    return (
        <Main>
            {
                label &&
                <label>{label}</label>
            }
            <Dropdown style={style}>
                <select name={name} onChange={onChange}>
                  {countries.map((country, index) => {
                      return (
                          <option key={index} value={country.code}>
                        {country.name}
                      </option>
                    );
                })}
                </select>
                <img width={40} height={20} src={`/assets/flags_3x2/${value}.svg`} alt="" />
            </Dropdown>
        </Main>
    )
}

const Main = styled.div`
display: flex;
flex-direction: column;
width: fit-content;
gap: 5px;
label {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.gray.GunmetalGray};
}
`

const Dropdown = styled.div`
  padding: 5px;
  position: relative;
  width: 100%;
  /* margin-left: 5px; */
  select {
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
  }
  img {
    height: 30px;
    padding: 5px;
    width: 100%;
    background: #f7f7f7;
  }
`;