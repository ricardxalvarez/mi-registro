import styled from "styled-components";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { startOfToday } from "date-fns";
// components
import Calendar from "../../../components/common/Calendar";
import Select from "../../../components/common/Select";
import AttendanceTable from "../../../components/teacher/AttendanceTable";
// types
import * as UtilsTypes from '../../../types/utils'
import * as GradeTypes from '../../../types/grade'
import * as StudentTypes from '../../../types/student'
// utils
import removeDuplicates from "../../../utils/removeDuplicates";
import TeacherService from "../../../services/teacher.service";

export default function Attendance() {
    const [sectionFilter, setSectionFilter] = useState<UtilsTypes.SectionFilter>({})
    const [sections, setSections] = useState<GradeTypes.Section[]>([])
    const [selectedDay, setSelectedDay] = useState(startOfToday())
    const [students, setStudents] = useState<StudentTypes.Student[]>([])
    const [subjects, setSubjects] = useState<{name: string, value: string}[]>([])
    console.log(sections)

    useEffect(() => {
        async function getInfo() {
            try {
                if (sections.length) return 
                const response = (await TeacherService.listSections()).data
                setSections(response.sections)
            } catch (error) {
                console.log(error)
            }
        }
        getInfo()
    }, [])
    
    const levelsArray = sections.map(section => section.level)
    const level = levelsArray.find(level => level.id === sectionFilter.level_id)
    
    function onChangeGrade(e: ChangeEvent<HTMLSelectElement>) {
        const name = e.target.name
        const value = e.target.value
        if (name === 'modality_id') {
            if (level?.name === 'secundario') {
                setStudents([])
            }
            setSectionFilter({ [name]: value, level_id: '', cycle_id: '', grade_id: '', section_id: '', subject_id: '' });
        }
        else if (name === 'level_id') {
            if (level?.name === 'secundario') {
                setStudents([])
            }
            setSectionFilter(prevData => ({...prevData, [name]: value, cycle_id: '', grade_id: '', section_id: '', subject_id: ''}))
        }
        else if (name === 'cycle_id') {
            if (level?.name === 'secundario') {
                setStudents([])
            }
            setSectionFilter(prevData => ({...prevData, [name]: value, grade_id: '', section_id: '', subject_id: ''}))
        }
        else if (name === 'grade_id') {
            if (level?.name === 'secundario') {
                setStudents([])
            }
            const grade = sections.find(section => section.grade_id === value)?.grade
            setSectionFilter(prevData => ({...prevData, grade_id: value, cycle_id: grade?.cycle_id, level_id: grade?.level_id, modality_id: grade?.modality_id, section_id: '', subject_id: ''}))
        }
        else if (name === 'section_id') {
            if (level?.name === 'secundario') {
                setStudents([])
            }
            const section = sections.find(section => section.id === value)
            setSectionFilter(prevData => ({...prevData, section_id: value, grade_id: section?.grade_id, cycle_id: section?.cycle_id, level_id: section?.level_id, modality_id: section?.modality_id, subject_id: ''}))
        }
        else
        setSectionFilter(prevData => ({...prevData, [name]: value}))
    }

    const modalities = useMemo(() => {
        const modalities = sections.map(section => section.modality)
        return removeDuplicates(modalities, 'id').map(modality => ({name: modality.name, value: modality.id}))
    }, [sections])
    const levels = useMemo(() => {
        const levels = sections.map(section => section.level)
        if (sectionFilter.modality_id) {
            const levels_filter = levels.filter(level => level.modality_id === sectionFilter.modality_id)
            return removeDuplicates(levels_filter, 'id').map(level => ({name: level.name, value: level.id}))
        } else return removeDuplicates(levels, 'id').map(level => ({name: level.name, value: level.id}))
    }, [sections, sectionFilter.modality_id])
    const cycles = useMemo(() => {
        const cycles = sections.map(section => section.cycle)
        if (sectionFilter.level_id) {
            const cycles_filter = cycles.filter(cycle => cycle.level_id === sectionFilter.level_id)
            return removeDuplicates(cycles_filter, 'id').map(cycle => ({name: cycle.name, value: cycle.id}))
        } else return removeDuplicates(cycles, 'id').map(cycle => ({name: cycle.name, value: cycle.id}))
    }, [sections, sectionFilter.level_id])
    const grades = useMemo(() => {
        const grades = sections.map(section => section.grade)
        const gradesFilter = grades.filter(grade => sectionFilter.modality_id ? grade.modality_id === sectionFilter.modality_id : true).filter(grade => sectionFilter.level_id ? grade.level_id === sectionFilter.level_id : true).filter(grade => sectionFilter.cycle_id ? grade.cycle_id === sectionFilter.cycle_id : true)
        return removeDuplicates(gradesFilter, 'id').map(grade => {
            const levels = sections.map(section => section.level)
            const level = levels.find(level => level.id === grade.level_id)
            return ({name: `${grade.name} ${level?.name}`, value: grade.id})
        })
    }, [sections, sectionFilter.cycle_id, sectionFilter.level_id, sectionFilter.modality_id])

    const sectionsFiltered = useMemo(() => {
        const sectionsFilter = sections.filter(section => sectionFilter.modality_id ? section.modality_id === sectionFilter.modality_id : true).filter(section => sectionFilter.level_id ? section.level_id === sectionFilter.level_id : true).filter(section => sectionFilter.cycle_id ? section.cycle_id === sectionFilter.cycle_id : true).filter(section => sectionFilter.grade_id ? section.grade_id === sectionFilter.grade_id : true)
        return removeDuplicates(sectionsFilter, 'id').map(section => ({name: `${section.grade.name} ${section.name} ${section.level.name}`, value: section.id}))
    }, [sections, sectionFilter])

    useEffect(() => {
        if (!sectionFilter.section_id) return
        const levels = sections.map(section => section.level)
        const level = levels.find(level => level.id === sectionFilter.level_id)
        if (!level) return 
        if (level.name === 'secundario') {
            getSubjectsSecundario()
            return 
        }
        async function getSubjectsSecundario() {
            if (!sectionFilter.section_id) return
            try {
                const response = (await TeacherService.listSubjectsByTeacher(sectionFilter.section_id)).data
                const array = response.map((subject: UtilsTypes.Subject)=> ({name: subject.name, value: subject.id}))
                setSubjects(array)
            } catch (error) {
                console.log(error)
            }
        }
        async function getStudents() {
            if (!sectionFilter.section_id) return
            try {
                const response = (await TeacherService.listStudentsBySection(sectionFilter.section_id)).data
                if (response) {
                    const newStudents = response.students
                    setStudents(newStudents)
                } else setStudents([])
            } catch (error) {
                console.log(error)
            }
            
        }
        getStudents()
    }, [sectionFilter.level_id ,sectionFilter.section_id, selectedDay])

    useEffect(() => {
        if (!sectionFilter.subject_id) return
        if (level?.name !== 'secundario') return
        async function getStudents() {
            if (!sectionFilter.section_id) return
            try {
                const response = (await TeacherService.listStudentsBySection(sectionFilter.section_id)).data
                if (response) {
                    const newStudents = response.students
                    setStudents(newStudents)
                } else setStudents([])
            } catch (error) {
                console.log(error)
            }
        }
        getStudents()
    }, [sectionFilter.subject_id, sectionFilter.section_id, level])

    
    return (
        <Main>
            <Filter>
                <Select
                label="Modalidad"
                value={sectionFilter.modality_id}
                name="modality_id"
                onChange={onChangeGrade}
                options={modalities}
                required
                defaultNull
                />
                <Select
                label="Nivel"
                value={sectionFilter.level_id}
                name="level_id"
                onChange={onChangeGrade}
                options={levels}
                required
                defaultNull
                />
                <Select
                label="Ciclo"
                value={sectionFilter.cycle_id}
                name="cycle_id"
                onChange={onChangeGrade}
                options={cycles}
                required
                defaultNull
                />
                <Select
                label="Grado"
                value={sectionFilter.grade_id}
                name="grade_id"
                onChange={onChangeGrade}
                options={grades}
                required
                defaultNull
                />
                <Select
                label="Sección"
                value={sectionFilter.section_id}
                name="section_id"
                onChange={onChangeGrade}
                options={sectionsFiltered}
                required
                defaultNull
                />
            </Filter>
            {
                level?.name === 'secundario' &&
                <Filter>
                    <Select
                    label="Asignatura"
                    value={sectionFilter.subject_id}
                    name="subject_id"
                    onChange={onChangeGrade}
                    options={subjects}
                    required
                    defaultNull
                    />
                </Filter>
            }
            <Filter
            style={{width: 'fit-content'}}
            >
                <Calendar
                selectedDay={selectedDay}
                selectPastDays
                setSelectedDay={(newDate: Date) => setSelectedDay(newDate)}
                />
            </Filter>
            {
                sectionFilter.section_id &&
                ((level?.name === 'secundario' && sectionFilter.subject_id) || level?.name !== 'secundario') &&
                <AttendanceTable
                students={students}
                section_id={sectionFilter.section_id}
                day={selectedDay}
                subject_id={sectionFilter.subject_id}
                />
            }
        </Main>
    )
}

const Main = styled.div`
width: 100%;
height: 100%;
`

const Filter = styled.div`
flex-wrap: wrap;
background-color: ${props => props.theme.white.White};
padding: 10px;
margin-bottom: 10px;
border-radius: 10px;
box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
display: flex;
align-items: center;
gap: 10px;
`