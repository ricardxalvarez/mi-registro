import styled from "styled-components";
import { useGlobal } from "../context/global";
import tabQueryParse from "../utils/tabQueryParse";

export default function Navbar() {
    const { tab, user } = useGlobal()
    const currentTab = tabQueryParse(tab)
    const tabsWithSpecialChar = [
        {
        tab: 'INSCRIPCION',
        display: 'INSCRIPCIÓN'
        },
        {
        tab: 'MI FORMACION',
        display: 'MI FORMACIÓN'
        },
    ]
    const specialTab = tabsWithSpecialChar.find(item => item.tab === currentTab)
    return (
        <Main>
            <span className="tab">
            {specialTab?.display || currentTab}
            </span>
            <div className="owner">
                <span>
                    Mi Conocimiento
                </span>
                <span className="slogan">
                    "Aprendiendo desde el amor"
                </span>
            </div>
            <div className="profile">
                <span className="name">
                {user?.name} {user?.lastName}
                </span>
                <span className="user">
                    {user?.source}
                </span>
            </div>
        </Main>
    )
}

const Main = styled.nav`
padding: 15px 20px;
box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};
display: flex;
justify-content: space-between;
align-items: center;
grid-column: 3 / -1;
background-color: ${props => props.theme.white.White};
width: calc(100% - 20px);
margin: auto;
margin-top: 10px;
border-radius: 10px;
.tab {
    width: 100px;
}
.owner {
    span {
        display: block;
        text-align: center;
    }
    span.slogan {
        font-size: 14px;
        color: ${props => props.theme.gray.Smoke};
    }
}
.profile {
    span {
        display: block;
        &.user {
            text-align: end;
            color: ${props => props.theme.gray.Smoke};
            font-size: 14px;
            text-transform: capitalize;
        }
    }
}
`