import styled from "styled-components";
import { useGlobal } from "../../context/global";
import Grades from "./tabs/Grades";
import Attendance from "./tabs/Attendance";
import Competencies from "./tabs/Competencies";
import Training from "./tabs/Training";

export default function HomeTeacher() {
    const {tab} = useGlobal()
    return (
        <Main>
            {
                (!tab || tab === 'home') &&
                <Competencies/>
            }
            {
                tab === 'calificaciones' &&
                <Grades/>
            }
            {
                tab === 'asistencia' &&
                <Attendance/>
            }
            {
                tab === 'mi-formacion' &&
                <Training/>
            }
        </Main>
    )
}

const Main = styled.div`
width: 100%;
height: 100%;
grid-column: 3 / -1;
grid-row: 2 / -1;
overflow: hidden;
overflow-y: unset;
padding: 10px;
`