import styled from "styled-components";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useGlobal } from "../context/global";
import tabParse from "../utils/tabParse";
import { IoLogOutOutline } from "react-icons/io5";

export default function Sidebar() {
    const { setTab, tab, user, setUser } = useGlobal()
    const admins = ['HOME', 'ACTAS', 'RECORD DE CALIFICACIONES', 'INSCRIPCIÓN']
    const teachers = ['HOME','CALIFICACIONES', 'ASISTENCIA', 'REPORTES / INFORMES', 'MI FORMACIÓN']
    const parents = ['HOME', 'VER CALIFICACIONES', 'REPORTES / INFORMES', 'ASISTENCIA']
    const students = ['HOME', 'DENUNCIA', 'CALIFICACIONES', 'MIS CLASES', 'ASISTENCIA', 'BIBLIOTECA', 'LECTURAS']
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const currentTab = queryParams.get('tab');
        if (!currentTab) return 
        setTab(currentTab)
    }, [location.search, setTab])

    function changeTab(newTab: string) {
        setTab(newTab)

        const { pathname, search } = location;

        // Add or update the query parameter
        const newParams = new URLSearchParams(search);
        newParams.set('tab', newTab);

        // Create a new path with the updated parameters
        const newPath = `${pathname}?${newParams.toString()}`;

        // Navigate to the new path
        navigate(newPath);
    }

    function logout() {
        localStorage.removeItem('user')
        setUser(null)
        navigate('/access')
    }
    return (
        <Main>
            {
                user.source === 'profesor' &&
                teachers.map((str, idx) => {
                    const newTab = tabParse(str)
                    return (
                        <div 
                        key={idx}
                        className={`item ${newTab === tab ? 'selected' : ''}`}
                        onClick={() => changeTab(newTab)}
                        >
                            <img src={`/assets/common/${newTab === tab ? newTab : `${newTab}_gray`}.svg`} alt=""/>
                            {str}
                        </div>
                    )
                })
            }
            {
                user.source === 'estudiante' &&
                students.map((str, idx) => {
                    const newTab = tabParse(str)
                    return (
                        <div 
                        key={idx}
                        className={`item ${newTab === tab ? 'selected' : ''}`}
                        onClick={() => changeTab(newTab)}
                        >
                            <img src={`/assets/common/${newTab === tab ? newTab : `${newTab}_gray`}.svg`} alt=""/>
                            {str}
                        </div>
                    )
                })
            }
            {
                user.source === 'administrador' &&
                admins.map((str, idx) => {
                    const newTab = tabParse(str)
                    return (
                        <div 
                        key={idx}
                        className={`item ${newTab === tab ? 'selected' : ''}`}
                        onClick={() => changeTab(newTab)}
                        >
                            <img src={`/assets/common/${newTab === tab ? newTab : `${newTab}_gray`}.svg`} alt=""/>
                            {str}
                        </div>
                    )
                })
            }
            {
                user.source === 'padre' &&
                parents.map((str, idx) => {
                    const newTab = tabParse(str)
                    return (
                        <div 
                        key={idx}
                        className={`item ${newTab === tab ? 'selected' : ''}`}
                        onClick={() => changeTab(newTab)}
                        >
                            <img src={`/assets/common/${newTab === tab ? newTab : `${newTab}_gray`}.svg`} alt=""/>
                            {str}
                        </div>
                    )
                })
            }
            <div className="logout"
            onClick={logout}
            >
                <IoLogOutOutline/>
            </div>
        </Main>
    )
}

const Main = styled.aside`
padding: 15px;
padding-top: 20%;
height: 100%;
width: 100%;
background-color: ${props => props.theme.white.White};
display: flex;
flex-direction: column;
justify-content: center;
position: relative;
gap: 10px;
.logout {
    position: absolute;
    bottom: 20px;
    left: 20px;
    font-size: 20px;
    cursor: pointer;
    padding: 7px;
    border-radius: 50%;
    background-color: ${props => props.theme.blue.Denim};
    color: ${props => props.theme.white.White};
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform .3s ease;
    &:hover {
        transform: translateY(-5px);
    }
}
.item {
    position: relative;
    padding-left: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    color: ${props => props.theme.gray.Pewter};
    &::before {
        transition: all .3s ease;
        position: absolute;
        left: 0;
        height: 100%;
        width: 5px;
        content: '';
        top: 0;
    }
    &.selected, &:hover {
        color: ${props => props.theme.blue.Denim};
        &::before {
            background-color: ${props => props.theme.blue.Denim};
        }
    }
    font-size: 14px;
    font-weight: 500;
    img {
        width: 25px;
        height: 25px;
        object-fit: cover;
    }
}
grid-row: 1 / -1;
grid-column: 1 / span 2;
`