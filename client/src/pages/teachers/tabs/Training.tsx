import { useState, ChangeEvent, useEffect, FormEvent } from "react";
import styled from "styled-components";
import * as TeacherType from "../../../types/teacher";
import genders from '../../../json/genders.json'
import careers from '../../../json/careers.json'
import current_studies from '../../../json/current_studies.json'
import civil_status from '../../../json/civil_status.json'
// utils
import isNumeric from "../../../utils/isNumeric";
import createAgeArray from "../../../utils/optionsArray";
// components
import Select from "../../../components/common/Select";
import GeneralInput from "../../../components/common/GeneralInput";
// services
import TeacherService from "../../../services/teacher.service";
import CountryInput from "../../../components/common/Country";

export default function Training() {
    const [data, setData] = useState<TeacherType.Teacher>({} as TeacherType.Teacher)
    const ages_list = createAgeArray(18, 80, 'años')

    useEffect(() => {
        async function getInfo() {
            if (!data.id) {
                try {
                    const response = await (await TeacherService.me()).data
                    console.log(response)
                    if (response) setData(response)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getInfo()
    }, [])

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.name
        const value = e.target.value
        setData(prevData => ({...prevData, [name]: value}))
    }

    function onChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
        const name = e.target.name
        let value: string | number = e.target.value
        if (isNumeric(value)) value = Number(value)
        setData(prevData => ({...prevData, [name]: value}))
    }

    const years_of_service_list = createAgeArray(1, 30, 'años')

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const newData: TeacherType.Training = {
                years_of_service: data.years_of_service,
                expertise: data.expertise,
                degree: data.degree,
                current_studies: data.current_studies,
                age: data.age,
                nationality: data.nationality,
                civil_status: data.civil_status,
                address: data.address,
                gender: data.gender,
                name: data.name,
                lastName: data.lastName,
                identification: data.identification,
            }
            const response = await TeacherService.update(newData)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Main
        onSubmit={onSubmit}
        >
            <div className="details">
                <h2>Detalles</h2>
                <div className="input-container">
                    <GeneralInput
                    label="Nombre"
                    maxLength={40}
                    name="name"
                    value={data.name || ''}
                    onChange={onChange}
                    />
                    <GeneralInput
                    label="Apellido"
                    maxLength={40}
                    name="lastName"
                    value={data.lastName || ''}
                    onChange={onChange}
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="Cédula"
                    name="identification"
                    value={data.identification || ''}
                    onChange={onChange}
                    />
                    <CountryInput
                    value={data.nationality}
                    label="Nacionalidad"
                    onChange={onChangeSelect}
                    name="nationality"
                    />
                    <Select
                    options={civil_status}
                    label="Estado civil"
                    name="civil_status"
                    value={data.civil_status}
                    onChange={onChangeSelect}
                    defaultNull
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    maxLength={500}
                    label="Dirección"
                    value={data.address || ''}
                    name="address"
                    onChange={onChange}
                    />
                    <Select
                    options={genders}
                    label="Género"
                    name="gender"
                    value={data.gender}
                    onChange={onChangeSelect}
                    defaultNull
                    />
                    <Select
                    options={ages_list}
                    label="Edad"
                    name="age"
                    value={data.age}
                    onChange={onChangeSelect}
                    defaultNull
                    />
                </div>
            </div>
            <div className="career">
                <h2>Formación</h2>
                <div className="input-container">
                    <Select
                    options={years_of_service_list}
                    label="Años de servicio"
                    name="years_of_service"
                    defaultValue={data.years_of_service}
                    value={data.years_of_service}
                    onChange={onChangeSelect}
                    defaultNull
                    />
                    <GeneralInput
                    label="Área de Especialización"
                    name="expertise"
                    value={data.expertise || ''}
                    onChange={onChange}
                    maxLength={120}
                    />
                </div>
                <div className="input-container"
                style={{marginBottom: '60px'}}
                >
                    <div style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                        <Select
                        options={careers}
                        name="degree"
                        onChange={onChangeSelect}
                        style={{height: '50px'}}
                        defaultNull
                        defaultValue={data.degree}
                        label="Título de grado alcanzado"
                        />
                        {
                            data.degree !== undefined &&
                            (!careers.some(item => item.value === data.degree) || data.degree === '') &&
                            <GeneralInput
                            value={data.degree}
                            name="degree"
                            maxLength={175}
                            onChange={onChange}
                            required
                            />
                        }
                    </div>
                    <div style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                        <Select
                        options={current_studies}
                        name="current_studies"
                        onChange={onChangeSelect}
                        style={{height: '50px'}}
                        defaultNull
                        defaultValue={data.current_studies}
                        label="Estudios que cursa en la actualidad"
                        />
                        {
                            data.current_studies !== undefined &&
                            (!current_studies.some(item => item.value === data.current_studies) || data.current_studies === '') &&
                            <GeneralInput
                            value={data.current_studies}
                            name="current_studies"
                            maxLength={125}
                            onChange={onChange}
                            required
                            />
                        }
                    </div>
                </div>
                <div className="actions">
                        <button
                        > Actualizar
                        </button>
                </div>
            </div>
        </Main>
    )
}

const Main = styled.form`
.details {
    width: 100%;
    padding: 10px;
    background-color: ${props => props.theme.white.White};
    border-radius: 10px;
    box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
    margin-bottom: 10px;
}
.career {
    width: 100%;
    padding: 10px;
    background-color: ${props => props.theme.white.White};
    border-radius: 10px;
    box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
}
h2 {
    font-size: 18px;
    color: ${props => props.theme.dark.Onyx};
    font-weight: 400;
}
.input-container {
    display: flex;
    align-items: end;
    gap: 5px;
    margin-bottom: 25px;
    width: 100%;
    flex-wrap: wrap;
    > div {
        flex: 1;
    }
}
.separator {
    margin-bottom: 20px;
}

.actions {
    margin-bottom: 20px;
    height: 2em;
button {
 padding: 0.8em 1.8em;
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

> button::before {
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

> button:hover::before {
 width: 110%;
}

> button:hover {
 color: ${props => props.theme.white.White};
}

}
`