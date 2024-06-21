import styled from "styled-components";
import { useEffect, useState } from "react";
import Checkbox from "../../common/Checkbox";
import * as StudentTypes from '../../../types/student'
import * as UtilTypes from '../../../types/utils'
import TeacherService from "../../../services/teacher.service";
import * as UtilsTypes from '../../../types/utils'
import { setDate } from "date-fns";
import Select from "../../common/Select";

interface AttendanceInterface {
    students: StudentTypes.Student[],
    section_id: string
    day: Date,
    subject_id?: string
}

export default function AttendanceTable({
    students,
    section_id,
    day,
    subject_id
}: AttendanceInterface) {
    const [attendance, setAttendance] = useState<UtilsTypes.Attendance[] | null>()

    useEffect(() => {
        setAttendance([])
        async function getInfo() {
            try {
                setAttendance(null)
                const response = (await TeacherService.getAttendance(section_id, day, subject_id)).data
                setAttendance(response)
            } catch (error) {
                console.log(error)
            }
        }
        getInfo()
    }, [day, section_id, subject_id])
    async function onChangeAttendance(newAttendance: string, student_id: string) {
        try {
            if (!attendance) return
            const oldItem = attendance.find(att => att.student_id === student_id)
            
            const newItem = {section_id, subject_id, day, student_id,...oldItem, attendance: newAttendance} as UtilsTypes.Attendance
            const filteredList = attendance.filter(att => att.student_id !== student_id)
            setAttendance([...filteredList, {...newItem}])
            const response = await TeacherService.postAttendance({attendance: newAttendance, student_id, day, section_id, subject_id} as UtilTypes.Attendance)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
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
                            <th
                            style={{width: '170px'}}
                            >Presente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students.map((student, idx) => {
                                const attendant = attendance ? attendance.find(att => att.student_id === student.id) : null
                                return (
                                    <tr>
                                        <td>{idx + 1}</td>
                                        <td>{student.lastName} {student.name}</td>
                                        <td>
                                            <Select
                                            value={attendant?.attendance || ''}
                                            options={[
                                                {
                                                    value: 'presente',
                                                    name: 'presente'
                                                },
                                                {
                                                    value: 'ausente',
                                                    name: 'ausente'
                                                },
                                                {
                                                    value: 'excusa',
                                                    name: 'excusa'
                                                },
                                                {
                                                    value: 'retraso',
                                                    name: 'retraso'
                                                }
                                            ]}
                                            onChange={e => onChangeAttendance(e.target.value, student.id)}
                                            defaultNull
                                            />
                                            {/* <Checkbox
                                            checked={ attendant?.attendant || false}
                                            /> */}
                                        </td>
                                    </tr>
                                )
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
    padding-bottom: 5vh;
    width: 100%;
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
        text-align: start;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: ${props => props.theme.gray.Platinum};
    }
    td {
        padding: 0 10px;
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