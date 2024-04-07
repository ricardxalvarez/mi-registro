import styled from "styled-components";
import { useState, useMemo, ChangeEvent, useEffect } from "react";
// components
import GradesTableP4 from "../../../components/teacher/GradesTable/P4";
import Select from "../../../components/common/Select";
import Kinder from "../../../components/teacher/GradesTable/Kinder";
// utils
import removeDuplicates from "../../../utils/removeDuplicates";
import TeacherService from "../../../services/teacher.service";
// types
import * as UtilsTypes from '../../../types/utils'
import * as GradeTypes from '../../../types/grade'
import * as StudentTypes from '../../../types/student'

export default function Grades() {
    const [sectionFilter, setSectionFilter] = useState<UtilsTypes.SectionFilter>({})
    const [sections, setSections] = useState<GradeTypes.Section[]>([])
    const [subjects, setSubjects] = useState<UtilsTypes.Subject[]>([])
    const [students, setStudents] = useState<StudentTypes.Student[]>([])
    const [periods, setPeriods] = useState<GradeTypes.Period[]>([])
    const [scopes, setScopes] = useState<GradeTypes.ScopeKinder[]>([])

    useEffect(() => {
        async function getInfo() {
            try {
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
            setStudents([])
            setSectionFilter({ [name]: value, level_id: '', cycle_id: '', grade_id: '', section_id: '', subject_id: '', period_id: '', scope_id: '', indicator_kinder_id: '' });
        }
        else if (name === 'level_id') {
            setStudents([])
            setSectionFilter(prevData => ({...prevData, [name]: value, cycle_id: '', grade_id: '', section_id: '', subject_id: '', period_id: '', scope_id: '', indicator_kinder_id: ''}))
        }
        else if (name === 'cycle_id') {
            setStudents([])
            setSectionFilter(prevData => ({...prevData, [name]: value, grade_id: '', section_id: '', subject_id: '', period_id: '', scope_id: '', indicator_kinder_id: ''}))
        }
        else if (name === 'grade_id') {
            setStudents([])
            const grade = sections.find(section => section.grade_id === value)?.grade
            setSectionFilter(prevData => ({...prevData, grade_id: value, cycle_id: grade?.cycle_id, level_id: grade?.level_id, modality_id: grade?.modality_id, section_id: '', subject_id: '', period_id: '', scope_id: '', indicator_kinder_id: ''}))
        }
        else if (name === 'section_id') {
            setStudents([])
            const section = sections.find(section => section.id === value)
            setSectionFilter(prevData => ({...prevData, section_id: value, grade_id: section?.grade_id, cycle_id: section?.cycle_id, level_id: section?.level_id, modality_id: section?.modality_id, subject_id: '', period_id: '', scope_id: '', indicator_kinder_id: ''}))
        }
        else if (name === 'subject_id') {
            setSectionFilter(prevData => ({...prevData, subject_id: value, period_id: ''}))
        }
        else if (name === 'scope_id') {
            setSectionFilter(prevData => ({...prevData, scope_id: value, indicator_kinder_id: ''}))
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
        async function getPeriods() {
            if (!sectionFilter.section_id) return
            try {
                const response = (await TeacherService.getPeriods(sectionFilter.section_id)).data
                setSubjects(response.subjects)
                setPeriods(response.periods)
                setScopes(response.scopes)
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
        getPeriods()
    }, [sectionFilter.section_id])
    
    const indicators_kinder = useMemo(() => {
        return scopes.find(s => s.id === sectionFilter.scope_id)?.indicators || []
    }, [sectionFilter.scope_id, scopes])

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
                (level?.name === 'secundario' || level?.name === 'primario') &&
                sectionFilter.section_id &&
                <Filter>
                    <Select
                    label="Asignatura"
                    value={sectionFilter.subject_id}
                    name="subject_id"
                    onChange={onChangeGrade}
                    options={subjects.map(s => ({name: s.name, value: s.id}))}
                    required
                    defaultNull
                    />
                    {
                        sectionFilter.subject_id &&
                        <Select
                        label="Periodo"
                        value={sectionFilter.period_id}
                        name="period_id"
                        onChange={onChangeGrade}
                        options={periods.map(p => ({name: p.type, value: p.id}))}
                        required
                        defaultNull
                        />
                    }
                </Filter>
            }
            {
                
                level?.name === 'inicial'  &&
                sectionFilter.section_id &&
                <Filter>
                    <Select
                    label="Área de especialización"
                    value={sectionFilter.scope_id}
                    name="scope_id"
                    onChange={onChangeGrade}
                    options={scopes.map(s => ({name: s.li, value: s.id}))}
                    required
                    defaultNull
                    />
                    {
                        sectionFilter.scope_id &&
                        <Select
                        label="Indicador de logro"
                        value={sectionFilter.indicator_kinder_id}
                        name="indicator_kinder_id"
                        onChange={onChangeGrade}
                        options={indicators_kinder.map(p => ({name: p.indicator, value: p.id}))}
                        required
                        defaultNull
                        />
                    }
                </Filter>
            }
            {
                (level?.name === 'secundario' || level?.name === 'primario') &&
                sectionFilter.subject_id &&
                sectionFilter.period_id &&
                <GradesTableP4
                periods={periods}
                subject_id={sectionFilter.subject_id}
                students={students}
                setPeriods={setPeriods}
                sectionFilter={sectionFilter}
                />
            }
            {
                level?.name === 'inicial' &&
                sectionFilter.scope_id &&
                sectionFilter.indicator_kinder_id &&
                <Kinder
                periods={periods}
                setPeriods={setPeriods}
                students={students}
                sectionFilter={sectionFilter}
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