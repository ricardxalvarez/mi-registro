import { Modal, ModalContainer } from "../styles/common/modal";
import { IoIosClose } from "react-icons/io";
import { useGlobal } from "../context/global";
import { ChangeEvent, FormEvent, useState } from "react";
import * as StudentTypes from '../types/student'
import Select from "../components/common/Select";
// enums
import genders from '../json/genders.json'
import civil_status from '../json/civil_status.json'
import lives_with from '../json/lives_with.json'
import levels from '../json/levels.json'
import influenza from '../json/influenza.json'
import spr from '../json/spr.json'
import neumoco from '../json/neumoco.json'
import bopv from '../json/bopv.json'
import hepatitis from '../json/hepatitis.json'
import dpt from '../json/dpt.json'
import covid from '../json/covid.json'
import vph from '../json/vph.json'
import dt from '../json/dt.json'
import pregnant_tdan from '../json/pregnant_tdan.json'
import pregnant_influenza from '../json/pregnant_influenza.json'
import student_status from '../json/student_status.json'
// utils
import isNumeric from "../utils/isNumeric";
// services
import AdminService from "../services/admin.service";
// components
import GeneralInput from "../components/common/GeneralInput";
import CountryInput from "../components/common/Country";
import Calendar from "../components/common/CalendarInput";
import Checkbox from "../components/common/Checkbox";
import createAgeArray from "../utils/optionsArray";
import ListInput from "../components/common/ListInput";

export default function SignUpStudent() {
    const {setSignupStudentModalOpen} = useGlobal()
    const [data, setData] = useState<StudentTypes.Student>({
        nationality: 'DO'
    } as StudentTypes.Student)
    
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

    async function register(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const response = await AdminService.registerStudent(data)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const siblings_ages = createAgeArray(1, 15, '')
    const siblings_ages_list = createAgeArray(1, 80, "años")

    console.log(data)
    return (
        <ModalContainer>
            <Modal onSubmit={register}>
                <h1>Registrar estudiante</h1>
                <h2>Datos del estudiante</h2>
                <div className="input-container">
                    <GeneralInput
                    maxLength={40}
                    label="Nombre"
                    value={data.name || ''}
                    name="name"
                    onChange={onChange}
                    required
                    />
                    <GeneralInput
                    maxLength={40}
                    label="Apellido"
                    value={data.lastName || ''}
                    name="lastName"
                    required
                    onChange={onChange}
                    />
                    <GeneralInput
                    maxLength={75}
                    label="Usuario"
                    value={data.username || ''}
                    name="username"
                    onChange={onChange}
                    required
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    maxLength={70}
                    label="Email"
                    value={data.email || ''}
                    name="email"
                    onChange={onChange}
                    required
                    type="email"
                    />
                    <GeneralInput
                    label="Identificación"
                    value={data.identification || ''}
                    name="identification"
                    onChange={onChange}
                    required
                    />
                    <GeneralInput
                    maxLength={500}
                    label="Dirección"
                    value={data.address || ''}
                    name="address"
                    onChange={onChange}
                    required
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="RNE"
                    value={data.RNE}
                    style={{flex: '1'}}
                    name="RNE"
                    onChange={onChange}
                    maxLength={255}
                    required
                    />
                    <GeneralInput
                    label="Lugar de nacimiento"
                    name="birth_place"
                    value={data.birth_place}
                    style={{flex: '1'}}
                    onChange={onChange}
                    maxLength={255}
                    required
                    />
                    <Calendar
                    label="Nacimiento"
                    selectedDay={data.birth}
                    selectPastDays
                    selectYear
                    setSelectedDay={(day: Date) => {
                        setData(prevData => ({...prevData, birth: day}))
                    }}
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
                    options={civil_status}
                    label="Estado civil"
                    name="civil_status"
                    value={data.civil_status}
                    onChange={onChangeSelect}
                    defaultNull
                    required
                    />
                    <GeneralInput
                    label="Contraseña"
                    name="password"
                    placeholder="Min. 8 caracteres"
                    value={data.password || ''}
                    onChange={onChange}
                    required
                    />
                    <CountryInput
                    value={data.nationality}
                    label="Nacionalidad"
                    onChange={onChangeSelect}
                    name="nationality"
                    />
                </div>
                <hr className="separator" />
                <h2>Datos del cuidador</h2>
                <div className="input-container">
                    <Select
                    label="Persona con quien vive"
                    name="lives_with"
                    options={lives_with}
                    defaultNull
                    value={data.lives_with}
                    onChange={onChangeSelect}
                    required
                    />
                    {
                        data.lives_with === 'otro'
                        &&
                        <>
                        <GeneralInput
                        label="Nombre de la persona"
                        value={data.lives_with_name}
                        onChange={onChange}
                        name="lives_with_name"
                        maxLength={75}
                        required
                        />
                        <GeneralInput
                        label="Apellido de la persona"
                        value={data.lives_with_lastName}
                        onChange={onChange}
                        name="lives_with_lastName"
                        maxLength={75}
                        required
                        />
                        </>
                    }
                </div>
                {
                    data.lives_with === 'otro'
                    &&
                    <>
                    <div className="input-container">
                    <GeneralInput
                    label="Relación con la persona"
                    value={data.lives_with_relationship}
                    onChange={onChange}
                    name="lives_with_relationship"
                    maxLength={75}
                    required
                    />
                    <GeneralInput
                    label="Dirección de la persona con quien vive"
                    value={data.lives_with_address}
                    onChange={onChange}
                    name="lives_with_address"
                    maxLength={255}
                    required
                    />
                    <GeneralInput
                    label="Teléfono de la persona con quien vive"
                    value={data.lives_with_phone}
                    onChange={onChange}
                    name="lives_with_phone"
                    maxLength={75}
                    required
                    />
                    </div>
                    <div className="input-container">
                        <GeneralInput
                        label="Email de la persona con quien vive"
                        value={data.lives_with_email}
                        onChange={onChange}
                        name="lives_with_email"
                        type="email"
                        maxLength={75}
                        required
                        />
                        <GeneralInput
                        label="Ocupación de la persona con quien vive"
                        value={data.lives_with_job}
                        onChange={onChange}
                        name="lives_with_job"
                        maxLength={155}
                        required
                        />
                        <GeneralInput
                        label="Dirección de trabajo de la persona con quien vive"
                        value={data.lives_with_job_address}
                        onChange={onChange}
                        name="lives_with_job_address"
                        required
                        maxLength={255}
                        />
                    </div>
                    </>
                }
                <hr className="separator" />
                <h2>Salud del estudiante</h2>
                <div className="input-container">
                    <GeneralInput
                    label="Nombre de persona de emergencia"
                    value={data.emergency_name}
                    onChange={onChange}
                    name="emergency_name"
                    maxLength={75}
                    required
                    />
                    <GeneralInput
                    label="Identificación de la persona de emergencia"
                    value={data.emergency_identification}
                    onChange={onChange}
                    name="emergency_identification"
                    maxLength={75}
                    required
                    />
                    <GeneralInput
                    label="Teléfono de la persona de emergencia"
                    value={data.emergency_phone}
                    onChange={onChange}
                    name="emergency_phone"
                    maxLength={155}
                    required
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="Alergias"
                    value={data.alergies}
                    onChange={onChange}
                    name="alergies"
                    maxLength={255}
                    required
                    />
                    <GeneralInput
                    label="Discapacidades"
                    value={data.disabilities}
                    onChange={onChange}
                    name="disabilities"
                    maxLength={255}
                    required
                    />
                    <GeneralInput
                    label="Medicinas"
                    value={data.medicines}
                    onChange={onChange}
                    name="medicines"
                    maxLength={255}
                    required
                    />
                </div>
                <hr className="separator" />
                <h2>Datos académicos</h2>
                <div className="input-container">
                    <Select
                    label="Nivel"
                    value={data.level}
                    name="level"
                    onChange={onChangeSelect}
                    options={levels}
                    required
                    defaultNull
                    />
                </div>
                {
                    data.level === 'inicial' &&
                    <>
                    <hr className="separator"/>
                    <h2>Hermanos</h2>
                    <div className="input-container">
                        <Select
                        label="Cantidad de hermanos"
                        value={data.siblings_quantity}
                        onChange={onChangeSelect}
                        name="siblings_quantity"
                        defaultNull
                        options={siblings_ages}
                        />
                        {  
                            data.siblings_quantity &&
                            data.siblings_quantity > 0 &&
                            <>
                            <ListInput
                            options={siblings_ages_list}
                            list={data.siblings_ages || []}
                            defaultNull
                            type="number"
                            label="Edades de los hermanos"
                            onChange={(newList: any[]) => {
                                if (data.siblings_quantity < newList.length) return
                                setData(prevData => ({...prevData, siblings_ages: newList}))
                            }}
                            />
                            <Select
                            options={createAgeArray(1, data.siblings_quantity + 1, "")}
                            label="Lugar que ocupa entre los hermanos"
                            defaultNull
                            value={data.sibling_place}
                            name='sibling_place'
                            onChange={onChangeSelect}
                            />
                            </>
                        }
                    </div>
                    <hr className="separator"/>
                    <h2>Salud del niño y vacunas</h2>
                    <div className="input-container">
                        <GeneralInput
                        label="Nombre del médico o pediatra"
                        value={data.doctor_name}
                        name="doctor_name"
                        onChange={onChange}
                        required
                        />
                        <GeneralInput
                        label="Teléfono del médito o pedriata"
                        value={data.doctor_phone}
                        name="doctor_phone"
                        onChange={onChange}
                        required
                        />
                        <GeneralInput
                        label="Execuatur del pediatra"
                        value={data.doctor_exequatur}
                        name="doctor_exequatur"
                        onChange={onChange}
                        required
                        />
                    </div>
                    <div className="input-container">
                        <Checkbox
                        checked={data.tuberculosis}
                        label="Tuberculosis"
                        onChange={(checked: boolean) => setData(prevData => ({...prevData, tuberculosis: checked}))}
                        />
                        <Select
                        label="Influenza"
                        options={influenza}
                        name="influenza"
                        value={data.influenza}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Select
                        label="SPR (12 meses)"
                        options={spr}
                        name="spr"
                        defaultNull
                        value={data.spr}
                        onChange={onChangeSelect}
                        required
                        />
                        <Select
                        label="Neumococo (12 meses)"
                        options={neumoco}
                        name="neumoco"
                        defaultNull
                        value={data.neumoco}
                        onChange={onChangeSelect}
                        required
                        />
                    </div>
                    <div className="input-container">
                        <Select
                        label="BOPV,DPT (18 meses) TDAN"
                        options={bopv}
                        name="bopv"
                        value={data.bopv}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Select
                        label="BOPV, DPT (4 AÑOS) DT INFLUENZA"
                        options={dpt}
                        name="dpt"
                        value={data.dpt}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Select
                        label="Hepatitis B (Al nacer) otavirus (IPV, Neumococo, Pentavalente, 2 4 y 6 meses)"
                        options={hepatitis}
                        name="hepatitis"
                        value={data.hepatitis}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Select
                        label="COVID 19 (5 AÑOS)"
                        options={covid}
                        name="covid"
                        value={data.covid}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                    </div>
                    <div className="input-container">
                        <Select
                        label="VPH (SOLO PARA NIÑOS) (9- 14 AÑOS)"
                        options={vph}
                        name="vph"
                        value={data.vph}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Select
                        label="DT (PARA NIÑOS Y NIÑAS) (9- 14 AÑOS)"
                        options={dt}
                        name="dt"
                        value={data.dt}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                    </div>
                    <h3>Embarazada</h3>
                    <div className="input-container">
                        <Checkbox
                        label="DT"
                        checked={data.pregnant_dt}
                        onChange={(checked: boolean) => setData(prevData => ({...prevData, pregnant_dt: checked}))}
                        />
                        <Select
                        label="TDAN"
                        options={pregnant_tdan}
                        name="pregnant_tdan"
                        value={data.pregnant_tdan}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Select
                        label="Influenza"
                        options={pregnant_influenza}
                        name="pregnant_influenza"
                        value={data.pregnant_influenza}
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                    </div>
                    </>
                }
                {
                    (data.level === 'secundario' || data.level === 'primario') &&
                    <>
                    <div className="input-container">
                        <Select
                        label="Condición del estudiante"
                        options={student_status}
                        name="student_status"
                        onChange={onChangeSelect}
                        required
                        defaultNull
                        />
                        <Calendar
                        label="Fecha de ingreso"
                        selectedDay={data.enrolled_at}
                        selectPastDays
                        selectYear
                        setSelectedDay={(day: Date) => {
                            setData(prevData => ({...prevData, enrolled_at: day}))
                        }}
                        />
                        <Calendar
                        label="Fecha de retiro / egreso"
                        selectedDay={data.removed_at}
                        selectPastDays
                        selectYear
                        setSelectedDay={(day: Date) => {
                            setData(prevData => ({...prevData, removed_at: day}))
                        }}
                        />
                    </div>
                    <div>
                        <Checkbox
                        label="Promovido"
                        checked={data.promoted}
                        onChange={(checked: boolean) => setData(prevData => ({...prevData, promoted: checked}))}
                        />
                    </div>
                    </>
                }
                <div className="actions">
                    <button
                    type="submit"
                    > Registrar
                    </button>
                </div>
                <div className="close"
                onClick={() =>  setSignupStudentModalOpen(false)}
                >
                    <IoIosClose/>
                </div>
            </Modal>
        </ModalContainer>
    )
}