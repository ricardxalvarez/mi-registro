import { Modal, ModalContainer } from "../styles/common/modal";
import { IoIosClose } from "react-icons/io";
import { useGlobal } from "../context/global";
import GeneralInput from "../components/common/GeneralInput";
import { ChangeEvent, FormEvent, useState } from "react";
import * as TeacherTypes from '../types/teacher'
import Select from "../components/common/Select";
import genders from '../json/genders.json'
import careers from '../json/careers.json'
import current_studies from '../json/current_studies.json'
import ranks from '../json/ranks.json'
import createAgeArray from "../utils/optionsArray";
import civil_status from '../json/civil_status.json'
import CountryInput from "../components/common/Country";
import AdminService from "../services/admin.service";
import isNumeric from "../utils/isNumeric";

export default function SignUpTeacher() {
    const {setSignupTeacherModalOpen} = useGlobal()
    const [data, setData] = useState<TeacherTypes.Teacher>({
        nationality: 'DO'
    } as TeacherTypes.Teacher)
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
    const ages_list = createAgeArray(18, 80, 'años')
    const years_of_service_list = createAgeArray(1, 30, 'años')

    async function register(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const response = await AdminService.registerTeacher(data)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ModalContainer>
            <Modal onSubmit={register}>
                <h1>Registrar profesor</h1>
                <div className="input-container">
                    <GeneralInput
                    maxLength={40}
                    label="Nombre"
                    value={data.name || ''}
                    name="name"
                    onChange={onChange}
                    />
                    <GeneralInput
                    maxLength={40}
                    label="Apellido"
                    value={data.lastName || ''}
                    name="lastName"
                    onChange={onChange}
                    />
                    <GeneralInput
                    maxLength={75}
                    label="Usuario"
                    value={data.username || ''}
                    name="username"
                    onChange={onChange}
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    maxLength={70}
                    label="Email"
                    value={data.email || ''}
                    name="email"
                    onChange={onChange}
                    type="email"
                    />
                    <GeneralInput
                    label="Identificación"
                    value={data.identification || ''}
                    name="identification"
                    onChange={onChange}
                    />
                    <GeneralInput
                    maxLength={500}
                    label="Dirección"
                    value={data.address || ''}
                    name="address"
                    onChange={onChange}
                    />
                </div>
                <div className="input-container">
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
                <div className="input-container">
                    <Select
                    options={civil_status}
                    label="Estado civil"
                    name="civil_status"
                    value={data.civil_status}
                    onChange={onChangeSelect}
                    defaultNull
                    />
                    <GeneralInput
                    label="Contraseña"
                    name="password"
                    placeholder="Min. 8 caracteres"
                    value={data.password || ''}
                    onChange={onChange}
                    />
                    <CountryInput
                    value={data.nationality}
                    label="Nacionalidad"
                    onChange={onChangeSelect}
                    name="nationality"
                    />
                </div>
                <hr className="separator" />
                <h2>Formación Académica</h2>
                <div className="input-container">
                    <Select
                    options={years_of_service_list}
                    label="Años de servicio"
                    name="years_of_service"
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
                    > Registrar
                    </button>
                </div>
                <div className="close"
                onClick={() =>  setSignupTeacherModalOpen(false)}
                >
                    <IoIosClose/>
                </div>
            </Modal>
        </ModalContainer>
    )
}