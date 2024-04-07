import styled from "styled-components";
// types
import * as UtilsTypes from '../../../types/utils'
import * as GradeTypes from '../../../types/grade'
import * as StudentTypes from '../../../types/student'
import { ChangeEvent, useEffect, useState, useMemo, Dispatch, SetStateAction } from "react";
import TeacherService from "../../../services/teacher.service";

interface GradesTableInterface {
    periods?: GradeTypes.Period[],
    setPeriods: Dispatch<SetStateAction<GradeTypes.Period[]>>
    level: UtilsTypes.Level
    students: StudentTypes.Student[]
    subject_id: string,
    sectionFilter: UtilsTypes.SectionFilter
}

function GradeRow({
    idx, student, grades, period, subject_id, setPeriods, periods
}: {idx: number, student: StudentTypes.Student, periods: GradeTypes.Period[], setPeriods: Dispatch<SetStateAction<GradeTypes.Period[]>>, subject_id: string, grades: GradeTypes.Calification[], calif?: GradeTypes.Calification, period?: GradeTypes.Period}) {
    const calif = useMemo(() => {
        return grades.find(g => (g.student_id === student.id && g.period_id === period?.id))
    }, [grades, student, period])

    const data = useMemo(() => {
        return ({
            period_id: period?.id,
            student_id: student.id,
            subject_id: subject_id,
            cp1: calif?.cp1,
            rcp1: calif?.rcp1,
            cp2: calif?.cp2,
            rcp2: calif?.rcp2,
            cp3: calif?.cp3,
            rcp3: calif?.rcp3,
        } as GradeTypes.Calification)
    }, [period, student, calif, subject_id])
    async function onChangeGrade(e: ChangeEvent<HTMLInputElement>) {
        if (!period) return
        const name = e.target.name
        const value = Number(e.target.value)
        const updatedGrade = {
            ...data,
            id: '30',
            [name]: value
        };
    
        // Update the parent component's state (periods) with the updated grade
        const updatedPeriods = periods.map((p) => {
          if (p.id === period.id) {
            const updatedGrades = p.grades.map((g) =>
              g.student_id === student.id ? updatedGrade : g
            );
            return { ...p, grades: updatedGrades };
          }
          return p;
        });
    
        // Update the parent component's periods state
        setPeriods(updatedPeriods);
        try {
            TeacherService.changeGrade({...data,
                period_id: period?.id,
                student_id: student.id,
                subject_id: subject_id,
                [name]: value})
        } catch (error) {
            console.log(error)
        }
    }
    const calif_cp1 = ((calif?.rcp1) || (calif?.cp1 || 0))
    const calif_cp2 = ((calif?.rcp2) || (calif?.cp2 || 0))
    const calif_cp3 = ((calif?.rcp3) || (calif?.cp3 || 0))
    return (
        <tr>
            <td className="info">{idx}</td>
            <td className="info">{student.lastName} {student.name}</td>
            <td>
                <input type="number"
                value={data.cp1 || ''}
                name="cp1"
                onChange={onChangeGrade}
                min={0}
                max={100}
                />
            </td>
            <td>
                <input type="number"
                value={data.rcp1 || ''}
                name="rcp1"
                onChange={onChangeGrade}
                min={0}
                max={100}
                />
            </td>
            <td>
                <input type="number"
                value={data.cp2 || ''}
                name="cp2"
                min={0}
                max={100}
                onChange={onChangeGrade}
                />
            </td>
            <td>
                <input type="number"
                value={data.rcp2 || ''}
                name="rcp2"
                min={0}
                max={100}
                onChange={onChangeGrade}
                />
            </td>
            <td>
                <input type="number"
                value={data.cp3 || ''}
                name="cp3"
                min={0}
                max={100}
                onChange={onChangeGrade}
                />
            </td>
            <td>
                <input type="number"
                value={data.rcp3 || ''}
                min={0}
                max={100}
                name="rcp3"
                onChange={onChangeGrade}
                />
            </td>
            <td
            className="info"
            >
                {
                    calif?.cp1 &&
                    calif.cp2 &&
                    calif.cp3 ?
                    <>{(calif_cp1 + calif_cp2 + calif_cp3) / 3}</>
                    : <></>
                }
            </td>
        </tr>
    )
}

export default function GradesTableP4({
    periods,
    setPeriods,
    subject_id,
    level,
    students,
    sectionFilter
}: GradesTableInterface) {
    const period = useMemo(() => {
        if (!periods) return
        return periods.find(p => p.id === sectionFilter.period_id)
    }, [sectionFilter.period_id, periods])
    const grades = useMemo(() => {
        if (!period) return []
        return period.grades.filter((calif => (calif.subject_id === sectionFilter.subject_id)))
    }, [period, sectionFilter.subject_id])
    if (!periods) return <></>
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
                            <th>RP1</th>
                            <th>P2</th>
                            <th>RP2</th>
                            <th>P3</th>
                            <th>RP3</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            grades &&
                            period &&
                            period?.section_id &&
                            students.map((student, idx) => {
                                return <GradeRow 
                                subject_id={subject_id}
                                periods={periods}
                                setPeriods={setPeriods}
                                key={idx} 
                                idx={idx + 1} 
                                student={student}
                                period={period}
                                grades={grades}
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
        input {
            width: 100%;
            height: 40px;
            text-align: center;
            border: none;
            background-color: rgba(0,0,0,0);
        }
    }
    tr {
        border-radius: 10px;
        overflow: hidden;
        height: 40px;
        width: 100%;
    }
`