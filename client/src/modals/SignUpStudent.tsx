import { Modal, ModalContainer } from "../styles/common/modal";
import { IoIosClose } from "react-icons/io";
import { useGlobal } from "../context/global";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import * as StudentTypes from '../types/student'
import * as GradeTypes from '../types/grade'
import * as UtilsTypes from '../types/utils'
// enums
import genders from '../json/genders.json'
import civil_status from '../json/civil_status.json'
import lives_with from '../json/lives_with.json'
import student_status from '../json/student_status.json'
// utils
import isNumeric from "../utils/isNumeric";
// services
import AdminService from "../services/admin.service";
// components
import Select from "../components/common/Select";
import GeneralInput from "../components/common/GeneralInput";
import CountryInput from "../components/common/Country";
import Calendar from "../components/common/CalendarInput";
import Checkbox from "../components/common/Checkbox";
import createAgeArray from "../utils/optionsArray";
import ListInput from "../components/common/ListInput";
import FileInput from "../components/common/FileInput";
import removeDuplicates from "../utils/removeDuplicates";

export default function SignUpStudent() {
    const {setSignupStudentModalOpen} = useGlobal()
    const [data, setData] = useState<StudentTypes.Student>({
        nationality: 'DO',
        health: {},
        documents: {}
    } as StudentTypes.Student)
    const [grades, setGrades] = useState<GradeTypes.Grade[]>([])
    const [gradeFilter, setGradeFilter] = useState<UtilsTypes.SectionFilter>({})
    const [sections, setSections] = useState<GradeTypes.Section[]>([])
    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.name
        const value = e.target.value
        setData(prevData => ({...prevData, [name]: value}))
    }

    function onChangeGrade(e: ChangeEvent<HTMLSelectElement>) {
        const name = e.target.name
        const value = e.target.value
        setData(prevData => ({...prevData, section_id: ''}))
        if (name === 'modality_id') {
            setGradeFilter({ [name]: value, level_id: '', cycle_id: '', grade_id: '' });
        }
        else if (name === 'level_id') {
            setGradeFilter(prevData => ({...prevData, [name]: value, cycle_id: '', grade_id: ''}))
        }
        else if (name === 'cycle_id') {
            setGradeFilter(prevData => ({...prevData, [name]: value, grade_id: ''}))
        }
        else if (name === 'grade_id') {
            const grade = grades.find(grade => grade.id === value)
            setGradeFilter(prevData => ({...prevData, grade_id: value, cycle_id: grade?.cycle_id, level_id: grade?.level_id, modality_id: grade?.modality_id}))
        }
    }

    function onChangeHealth(data: string | Date, name: string) {
        setData(prevData => ({...prevData, health: {...prevData.health, [name]: data}}))
    }
    
    function onChangeDocuments(newFile: File | undefined, name: keyof StudentTypes.Documents) {
        console.log(newFile)
        setData(prevData => ({...prevData, documents: {...prevData.documents, [name]: newFile}}))
    }
    
    function onChangeHealthVaccine(newData: Date, name: keyof StudentTypes.Health, key: string) {
        const oldObject = data.health[name]
        if (typeof oldObject !== 'object') {
            if (typeof oldObject === 'undefined') {
                const newObject = {[key]: newData}
                setData(prevData => ({...prevData, health: {...prevData.health, [name]: newObject}}))
                return
            }
            return
        }
        const newObject = {...oldObject, [key]: newData}
        setData(prevData => ({...prevData, health: {...prevData.health, [name]: newObject}}))
    }
    function onChangeSelect(e: ChangeEvent<HTMLSelectElement>) {
        const name = e.target.name
        let value: string | number = e.target.value
        if (isNumeric(value)) value = Number(value)
        setData(prevData => ({...prevData, [name]: value}))
    }

    async function register(e: FormEvent<HTMLFormElement>) {
        function isFile(obj: any): boolean {
            return obj instanceof File;
        }
        e.preventDefault()
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object' && !Array.isArray(value) && !(Object.prototype.toString.call(value) === '[object Date]') && !isFile(value)) {
                    // Handle nested objects (e.g., health and documents)
                    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                        if (typeof nestedValue === 'object' && !Array.isArray(nestedValue) && !(Object.prototype.toString.call(nestedValue) === '[object Date]') && !isFile(nestedValue)) {
                            Object.entries(value).forEach(([childNestedKey, childNestedValue]) => {
                                let newChildNestedValue = childNestedValue
                                if (Array.isArray(childNestedValue)) newChildNestedValue = JSON.stringify(childNestedKey)
                                formData.append(`${nestedKey}_${childNestedKey}`, newChildNestedValue as any)
                            })
                        } else {
                            let newNestedValue = nestedValue
                            if (Array.isArray(nestedValue)) newNestedValue = JSON.stringify(nestedValue)
                            formData.append(nestedKey, newNestedValue as any);
                        }
                    });
                } else {
                    // console.log(value)
                    let newValue = value
                    if (Array.isArray(value)) newValue = JSON.stringify(value)
                    console.log(newValue)
                    formData.append(key, newValue);
                }
            });
            console.log(formData)
            const response = await AdminService.registerStudent(formData)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getInfo() {
            try {
                const response = (await AdminService.getGrades()).data
                setGrades(response)
            } catch (error) {
                console.log(error)
            }
        }
        getInfo()
    }, [])

    useEffect(() => {
        if (!gradeFilter.grade_id) return 
        async function getSections() {
            if (!gradeFilter.grade_id) return
            try {
                const response = (await AdminService.getSectionsByGrade(gradeFilter.grade_id)).data
                setSections(response)
            } catch (error) {
                console.log(error)
            }
        }
        getSections()
    }, [gradeFilter.grade_id])

    const siblings_ages = createAgeArray(1, 15, '')
    const siblings_ages_list = createAgeArray(1, 80, "años")
    const modalities = useMemo(() => {
        const modalities = grades.map(grade => grade.modality)
        return removeDuplicates(modalities, 'id').map(modality => ({name: modality.name, value: modality.id}))
    }, [grades])
    const levels = useMemo(() => {
        const levels = grades.map(grade => grade.level)
        if (gradeFilter.modality_id) {
            const levels_filter = levels.filter(level => level.modality_id === gradeFilter.modality_id)
            return removeDuplicates(levels_filter, 'id').map(level => ({name: level.name, value: level.id}))
        } else return removeDuplicates(levels, 'id').map(level => ({name: level.name, value: level.id}))
    }, [grades, gradeFilter])
    const cycles = useMemo(() => {
        const cycles = grades.map(grade => grade.cycle)
        if (gradeFilter.level_id) {
            const cycles_filter = cycles.filter(cycle => cycle.level_id === gradeFilter.level_id)
            return removeDuplicates(cycles_filter, 'id').map(cycle => ({name: cycle.name, value: cycle.id}))
        } else return removeDuplicates(cycles, 'id').map(cycle => ({name: cycle.name, value: cycle.id}))
    }, [grades, gradeFilter.level_id])
    const gradesFiltered = useMemo(() => {
        const gradesFilter = grades.filter(grade => gradeFilter.modality_id ? grade.modality_id === gradeFilter.modality_id : true).filter(grade => gradeFilter.level_id ? grade.level_id === gradeFilter.level_id : true).filter(grade => gradeFilter.cycle_id ? grade.cycle_id === gradeFilter.cycle_id : true)
        return removeDuplicates(gradesFilter, 'id').map(grade => ({name: `${grade.name} ${grade.level.name}`, value: grade.id}))
    }, [grades, gradeFilter.cycle_id, gradeFilter.level_id, gradeFilter.modality_id])
    const ModalRef = useRef<HTMLFormElement>(null)

    console.log(data)

    return (
        <ModalContainer>
            <Modal ref={ModalRef} onSubmit={register}>
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
                    modalRef={ModalRef}
                    selectPastDays
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
                    value={data.health?.emergency_name || ''}
                    onChange={e => onChangeHealth(e.target.value, e.target.name)}
                    name="emergency_name"
                    maxLength={75}
                    required
                    />
                    <GeneralInput
                    label="Identificación de la persona de emergencia"
                    value={data.health?.emergency_identification || ''}
                    onChange={e => onChangeHealth(e.target.value, e.target.name)}
                    name="emergency_identification"
                    maxLength={75}
                    required
                    />
                    <GeneralInput
                    label="Teléfono de la persona de emergencia"
                    value={data.health?.emergency_phone || ''}
                    onChange={e => onChangeHealth(e.target.value, e.target.name)}
                    name="emergency_phone"
                    maxLength={155}
                    required
                    />
                </div>
                <div className="input-container">
                    <GeneralInput
                    label="Alergias"
                    value={data.health?.alergies || ''}
                    onChange={e => onChangeHealth(e.target.value, e.target.name)}
                    name="alergies"
                    maxLength={255}
                    required
                    />
                    <GeneralInput
                    label="Discapacidades"
                    value={data.health?.disabilities || ''}
                    onChange={e => onChangeHealth(e.target.value, e.target.name)}
                    name="disabilities"
                    maxLength={255}
                    required
                    />
                    <GeneralInput
                    label="Medicinas"
                    value={data.health?.medicines || ''}
                    onChange={e => onChangeHealth(e.target.value, e.target.name)}
                    name="medicines"
                    maxLength={255}
                    required
                    />
                </div>
                <hr className="separator" />
                <h2>Documentos</h2>
                <div className="input-container">
                    <FileInput
                    value={data.documents.admission_test}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'admission_test')}
                    label="Prueba de admisión"
                    accept=".pdf"
                    deleteFile={() => onChangeDocuments(undefined, 'admission_test')}
                    />
                    <FileInput
                    value={data.documents.behavior_letter}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'behavior_letter')}
                    label="Carta de conducta"
                    deleteFile={() => onChangeDocuments(undefined, 'behavior_letter')}
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.birth_warrant}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'birth_warrant')}
                    deleteFile={() => onChangeDocuments(undefined, 'birth_warrant')}
                    label="Acta de nacimiento"
                    accept=".pdf"
                    />
                </div>
                <div className="input-container">
                    <FileInput
                    value={data.documents.birth_certificate}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'birth_certificate')}
                    deleteFile={() => onChangeDocuments(undefined, 'birth_certificate')}
                    label="Certificado de nacimiento"
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.evlc_sicometric}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'evlc_sicometric')}
                    deleteFile={() => onChangeDocuments(undefined, 'evlc_sicometric')}
                    label="EVLC Sicométrica"
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.family_letter}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'family_letter')}
                    deleteFile={() => onChangeDocuments(undefined, 'family_letter')}
                    label="Carta de familia"
                    accept=".pdf"
                    />
                </div>
                <div className="input-container">
                    <FileInput
                    value={data.documents.father_id}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'father_id')}
                    deleteFile={() => onChangeDocuments(undefined, 'father_id')}
                    label="Cédula de padre"
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.mother_id}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'mother_id')}
                    deleteFile={() => onChangeDocuments(undefined, 'mother_id')}
                    label="Cédula de madre"
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.form_inscription}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'form_inscription')}
                    deleteFile={() => onChangeDocuments(undefined, 'form_inscription')}
                    label="Formulario de inscripción"
                    accept=".pdf"
                    />
                </div>
                <div className="input-container">
                    <FileInput
                    value={data.documents.health_insurance}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'health_insurance')}
                    deleteFile={() => onChangeDocuments(undefined, 'health_insurance')}
                    label="Seguro médico"
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.vaccination_card}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'vaccination_card')}
                    deleteFile={() => onChangeDocuments(undefined, 'vaccination_card')}
                    label="Esquema de vacunación"
                    accept=".pdf"
                    />
                </div>
                <div className="input-container">
                    <FileInput
                    value={data.documents.photo}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'photo')}
                    deleteFile={() => onChangeDocuments(undefined, 'photo')}
                    label="Foto"
                    accept=".png, .jpg, .jpeg, .heic"
                    />
                    <FileInput
                    value={data.documents.id_card}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'id_card')}
                    deleteFile={() => onChangeDocuments(undefined, 'id_card')}
                    label="Cédula"
                    accept=".pdf"
                    />
                    <FileInput
                    value={data.documents.passport}
                    onChange={(newFile: File) => onChangeDocuments(newFile, 'passport')}
                    deleteFile={() => onChangeDocuments(undefined, 'passport')}
                    label="Pasaporte"
                    accept=".pdf"
                    />
                </div>
                <hr className="separator" />
                <h2>Datos académicos</h2>
                <div className="input-container">
                    <Select
                    label="Modalidad"
                    value={gradeFilter.modality_id}
                    name="modality_id"
                    onChange={onChangeGrade}
                    options={modalities}
                    required
                    defaultNull
                    />
                    <Select
                    label="Nivel"
                    value={gradeFilter.level_id}
                    name="level_id"
                    onChange={onChangeGrade}
                    options={levels}
                    required
                    defaultNull
                    />
                    <Select
                    label="Ciclo"
                    value={gradeFilter.cycle_id}
                    name="cycle_id"
                    onChange={onChangeGrade}
                    options={cycles}
                    required
                    defaultNull
                    />
                    <Select
                    label="Grado"
                    value={gradeFilter.grade_id}
                    name="grade_id"
                    onChange={onChangeGrade}
                    options={gradesFiltered}
                    required
                    defaultNull
                    />
                    {
                        gradeFilter.grade_id &&
                        <Select
                        label="Sección"
                        value={data.section_id}
                        name="section_id"
                        onChange={onChangeSelect}
                        options={sections.map(section => ({name: section.name, value: section.id}))}
                        required
                        defaultNull
                        />
                    }
                </div>
                {
                    levels.find(level => level.value === gradeFilter.level_id)?.name === 'inicial' &&
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
                        value={data.health?.doctor_name || ''}
                        name="doctor_name"
                        onChange={e => onChangeHealth(e.target.value, e.target.name)}
                        required
                        />
                        <GeneralInput
                        label="Teléfono del médito o pedriata"
                        value={data.health?.doctor_phone || ''}
                        name="doctor_phone"
                        onChange={e => onChangeHealth(e.target.value, e.target.name)}
                        required
                        />
                        <GeneralInput
                        label="Execuatur del pediatra"
                        value={data.health?.doctor_exequatur || ''}
                        name="doctor_exequatur"
                        onChange={e => onChangeHealth(e.target.value, e.target.name)}
                        required
                        />
                    </div>
                    <div className="input-container">
                        <div>
                            <h4>TUBERCULOSIS (BCG), (AL NACER)</h4>
                            <Calendar
                            label="ÚNICA"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.tuberculosis}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'tuberculosis')}
                            />
                        </div>
                        <div>
                            <h4>HEPATITIS B (AL NACER)</h4>
                            <Calendar
                            label="ÚNICA"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.hepatitis}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'hepatitis')}
                            />
                        </div>
                    </div>
                    <h4>ROTAVIRUS(IPV, NEUMOCOCO, PENTAVALENTE), (2, 4 Y 6 MESES)</h4>
                    <div className="input-container">
                        <Calendar
                        label="1ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.rotavirus?.first}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'rotavirus', 'first')}
                        />
                        <Calendar
                        label="2ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.rotavirus?.second}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'rotavirus', 'second')}
                        />
                        <Calendar
                        label="3ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.rotavirus?.third}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'rotavirus', 'third')}
                        />
                    </div>
                    <h4>INFLUENZA (6 ,7 MESES DE NACIDO Y ANUAL)</h4>
                    <div className="input-container">
                        <Calendar
                        label="1ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.influenza?.first}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'influenza', 'first')}
                        />
                        <Calendar
                        label="2ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.influenza?.second}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'influenza', 'second')}
                        />
                        <Calendar
                        label="REFUERZO ANUAL"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.influenza?.boost}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'influenza', 'boost')}
                        />
                    </div>
                    <div className="input-container">
                        <div>
                            <h4>SPR (12 MESES)</h4>
                            <Calendar
                            label="1ᵃ"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.spr_12}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'spr_12')}
                            />
                        </div>
                        <div>
                            <h4>NEUMOCOCO (12 MESES)</h4>
                            <Calendar
                            label="REFUERZO ANUAL"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.neumoco}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'neumoco')}
                            />
                        </div>
                        <div>
                            <h4>SPR (18 MESES)</h4>
                            <Calendar
                            label="2ᵃ"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.spr_18}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'spr_18')}
                            />
                        </div>
                    </div>
                    <h4>BOPV, DPT (18 MESES) TDAN</h4>
                    <div className="input-container">
                        <Calendar
                        label="1ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.bopv_dpt_tdan?.first}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'bopv_dpt_tdan', 'first')}
                        />
                        <Calendar
                        label="REFUERZO ANUAL"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.bopv_dpt_tdan?.boost}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'bopv_dpt_tdan', 'boost')}
                        />
                    </div>
                    <h4>BOPV, DPT (4 AÑOS) DT INFLUENZA</h4>
                    <div className="input-container">
                        <Calendar
                        label="2ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.bopv_dpt_dt?.second}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'bopv_dpt_dt', 'second')}
                        />
                        <Calendar
                        label="REFUERZO ANUAL"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.bopv_dpt_dt?.boost}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'bopv_dpt_dt', 'boost')}
                        />
                    </div>
                    <h4>COVID 19 (5 AÑOS)</h4>
                    <div className="input-container">
                        <Calendar
                        label="1ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.covid?.first}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'covid', 'first')}
                        />
                        <Calendar
                        label="2ᵃ DOSIS SEGÚN ESQUEMA"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.covid?.second}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'covid', 'second')}
                        />
                    </div>
                    <h4>VPH (SOLO PARA NIÑOS) (9- 14 AÑOS)</h4>
                    <div className="input-container">
                        <Calendar
                        label="1ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.vph?.first}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'vph', 'first')}
                        />
                        <Calendar
                        label="2ᵃ (6 MESES DESPUÉS)"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.vph?.second}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'vph', 'second')}
                        />
                    </div>
                    <h4>DT (PARA NIÑOS Y NIÑAS) (9- 14 AÑOS)</h4>
                    <div className="input-container">
                        <Calendar
                        label="3ᵃ"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.dt?.third}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'dt', 'third')}
                        />
                        <Calendar
                        label="REFUERZO A LOS 10 AÑOS"
                        mainContainerStyle={{alignItems: 'flex-start'}}
                        modalRef={ModalRef}
                        selectPastDays
                        selectedDay={data.health?.dt?.boost}
                        setSelectedDay={(newDate: Date) => onChangeHealthVaccine(newDate, 'dt', 'boost')}
                        />
                    </div>
                    <h4>EMBARAZADA</h4>
                    <div className="input-container">
                        <div>
                            <h4>TDAN</h4>
                            <Calendar
                            label="1 (UNA)"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.pregnant_tdan}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'pregnant_tdan')}
                            />
                        </div>
                        <div>
                            <h4>INFLUENZA</h4>
                            <Calendar
                            label="1 (UNA) DOSIS"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.pregnant_influenza}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'pregnant_influenza')}
                            />
                        </div>
                        <div>
                            <h4>DT</h4>
                            <Calendar
                            label="2 DOSIS O MÁS SEGÚN SU ESQUEMA"
                            mainContainerStyle={{alignItems: 'flex-start'}}
                            modalRef={ModalRef}
                            selectPastDays
                            selectedDay={data.health?.pregnant_dt}
                            setSelectedDay={(newDate: Date) => onChangeHealth(newDate, 'pregnant_dt')}
                            />
                        </div>
                    </div>
                    </>
                }
                {
                    (levels.find(level => level.value === gradeFilter.level_id)?.name === 'secundario' 
                    || levels.find(level => level.value === gradeFilter.level_id)?.name === 'primario') &&
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
                        modalRef={ModalRef}
                        selectPastDays
                        setSelectedDay={(day: Date) => {
                            setData(prevData => ({...prevData, enrolled_at: day}))
                        }}
                        />
                        <Calendar
                        label="Fecha de retiro / egreso"
                        modalRef={ModalRef}
                        selectedDay={data.removed_at}
                        selectPastDays
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