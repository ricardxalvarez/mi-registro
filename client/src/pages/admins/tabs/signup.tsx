import styled from "styled-components";
import Button from "../../../styles/common/button";
import { useGlobal } from "../../../context/global";

export default function SignUp() {
    const {
        setSignupTeacherModalOpen,
        setSignupStudentModalOpen,
        setSignupParentModalOpen,
    } = useGlobal()
    return (
        <Main>
            <div className="actions">
                <Button
                onClick={() => setSignupTeacherModalOpen(true)}
                >Registrar profesor</Button>
                <Button
                onClick={() => setSignupStudentModalOpen(true)}
                >Registrar alumno</Button>
                <Button
                onClick={() => setSignupParentModalOpen(true)}
                >Registrar padre</Button>
            </div>
        </Main>
    )
}

const Main = styled.div`
margin: auto;
height: 100%;
width: calc(100% - 20px);
margin-top: 20px;
.actions {
    display: flex;
    justify-content: space-evenly;
}
`