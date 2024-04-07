import styled from "styled-components";
import { useState, Dispatch, SetStateAction, useMemo, ChangeEvent, useEffect } from "react";
// types
import * as UtilsTypes from '../../../types/utils'
import * as GradeTypes from '../../../types/grade'
import * as StudentTypes from '../../../types/student'
import grades_kinder from '../../../json/grades_kinder.json'
// services
import TeacherService from "../../../services/teacher.service";


interface GradesTableInterface {
    periods?: GradeTypes.Period[],
    setPeriods: Dispatch<SetStateAction<GradeTypes.Period[]>>
    students: StudentTypes.Student[]
    sectionFilter: UtilsTypes.SectionFilter
}

function GradeRow({
    idx, student, setPeriods, periods, periodList, indicator
}: {idx: number, student: StudentTypes.Student, indicator?: string, periodList: GradeTypes.Period[], periods: GradeTypes.Period[], setPeriods: Dispatch<SetStateAction<GradeTypes.Period[]>>}) {
    useEffect(() => {
        setData({
            grade1: periodList[0]?.grades[0]?.grade,
            grade2: periodList[1]?.grades[0]?.grade,
            grade3: periodList[2]?.grades[0]?.grade
        })
    }, [periodList])
    const [data, setData] = useState({
        grade1: periodList[0]?.grades[0]?.grade,
        grade2: periodList[1]?.grades[0]?.grade,
        grade3: periodList[2]?.grades[0]?.grade
    })
    async function onChangeGrade(e: ChangeEvent<HTMLSelectElement>, period_id: string) {
        const value = e.target.value
        const updatedGrade = {
            student_id: student.id,
            period_id,
            indicator_kinder_id: indicator,
            grade: value
        };
        // Update the parent component's state (periods) with the updated grade
        const updatedPeriods = periods.map((p) => {
          if (p.id === period_id) {
            const updatedGrades = p.grades.some(g => g.student_id === student.id && g.indicator_kinder_id === indicator) ? p.grades.map((g) =>
              g.student_id === student.id ? updatedGrade : g
            )
            : [...p.grades, updatedGrade];
            return { ...p, grades: updatedGrades };
          }
          return p;
        });
        console.log(updatedPeriods)
        // Update the parent component's periods state
        setPeriods(updatedPeriods as GradeTypes.Period[]);
        try {
            TeacherService.changeGrade({
                student_id: student.id,
                period_id,
                indicator_kinder_id: indicator,
                grade: value
                } as GradeTypes.Calification)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <tr>
            <td className="info">{idx}</td>
            <td className="info">{student.lastName} {student.name}</td>
            <td>
                <select
                defaultValue={data.grade1}
                onChange={e => onChangeGrade(e, periodList[0].id)}
                >
                    {
                        grades_kinder.map((g) => {
                            return (
                                <option 
                                selected={data.grade1 === g.value || g.value === 'N/E'}  
                                value={g.value}>{g.name}</option>
                            )
                        })
                    }
                </select>
            </td>
            <td>
                <select
                defaultValue={data.grade2}
                onChange={e => onChangeGrade(e, periodList[1].id)}
                >
                    {
                        grades_kinder.map((g) => {
                            return (
                                <option 
                                selected={data.grade2 === g.value || g.value === 'N/E'}  
                                value={g.value}>{g.name}</option>
                            )
                        })
                    }
                </select>
            </td>
            <td>
                <select
                defaultValue={data.grade3}
                onChange={e => onChangeGrade(e, periodList[2].id)}
                >
                    {
                        grades_kinder.map((g) => {
                            return (
                                <option 
                                selected={data.grade3 === g.value || g.value === 'N/E'}  
                                value={g.value}>{g.name}</option>
                            )
                        })
                    }
                </select>
            </td>
        </tr>
    )
}

export default function Kinder({
    periods,
    setPeriods,
    students,
    sectionFilter
}: GradesTableInterface) {
    console.log(periods)
    return (
        <Main>
            <TableWrapper>
                <Table>
                    <thead>
                        <tr>
                            <th
                            style={{width: '40px'}}
                            ></th>
                            <th>Nombre</th>
                            <th>P1</th>
                            <th>P2</th>
                            <th>P3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            periods &&
                            students.map((student, idx) => {
                                const periodsList: GradeTypes.Period[] = []
                                periods.forEach((p) => {
                                    const grade = p.grades.find(g => g.indicator_kinder_id === sectionFilter.indicator_kinder_id && g.student_id === student.id)
                                    if (!grade) periodsList.push({...p, grades: []})
                                    else periodsList.push({...p, grades: [grade]})
                                })
                                return <GradeRow 
                                periodList={periodsList}
                                periods={periods}
                                setPeriods={setPeriods}
                                key={idx} 
                                idx={idx + 1} 
                                student={student}
                                indicator={sectionFilter.indicator_kinder_id}
                                />
                            })
                        }
                    </tbody>
                </Table>
            </TableWrapper>
        </Main>
    )
}

const TableWrapper = styled.div`
    overflow: auto;
    width: 100%;
    max-height: calc(100% - 40px);
    box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
    `

const Main = styled.div`
    width: 100%;
    padding-bottom: 5vh;
    `

const Table = styled.table`
    background-color: ${props => props.theme.blue.BlueGray};
    border: 2px solid ${props => props.theme.gray.BlueGray};
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    min-width: 500px;
    overflow: hidden;
    border-radius: 10px;
    th {
        padding: 0 10px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: ${props => props.theme.gray.Platinum};
    }
    td.info {
        padding: 0 10px;
    }
    td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background-color: ${props => props.theme.white.White};
        select {
            width: 100%;
            height: 40px;
            flex: 1;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: transparent;
            background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
            background-repeat: no-repeat;
            background-position-x: 90%;
            background-position-y: 50%;
            border: none;
            width: 100%;
            padding: 10px 15px;
            outline: none;
        }
    }
    tr {
        border-radius: 10px;
        overflow: hidden;
        height: 40px;
        width: 100%;
    }
`