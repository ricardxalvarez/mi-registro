import styled from "styled-components";
import HomeTeacher from "./teachers/Home";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import * as UserTypes from '../types/user'
import { useGlobal } from "../context/global";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeAdmin from "./admins";
import SignUpTeacher from "../modals/SignUpTeacher";
import SignUpStudent from "../modals/SignUpStudent";
import SignUpParent from "../modals/SignUpParent";

export default function Home() {
    const {
        user, 
        signupTeacherModalOpen,
        signupStudentModalOpen,
        signupParentModalOpen,
    } = useGlobal()
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) navigate('/access')
    }, [user, navigate])
    return (
        <Main>
            <Grid>
                <Sidebar/>
                <Navbar/>
                {
                    user.source === 'profesor' &&
                    <HomeTeacher/>
                }
                {
                    user.source === 'administrador' &&
                    <HomeAdmin/>
                }
                
            </Grid>
            {
                signupTeacherModalOpen &&
                <SignUpTeacher/>
            }
            {
                signupStudentModalOpen &&
                <SignUpStudent/>
            }
            {
                signupParentModalOpen &&
                <SignUpParent/>
            }
        </Main>
    )
}

const Main = styled.div`
position: relative;
height: 100vh;
width: 100vw;
background-color: ${props => props.theme.gray.Platinum};
position: relative;
`

const Grid = styled.div`
width: 85%;
height: 85%;
max-width: 1000px;
max-height: 900px;
display: grid;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background-color: ${props => props.theme.blue.PastelBlue};
border-radius: 15px;
box-shadow: 0 5px 15px ${props => props.theme.shadow.Dark200};
grid-template-columns: repeat(8, 1fr);
grid-template-rows: repeat(12, 1fr);
overflow: hidden;
`