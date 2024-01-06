import styled from "styled-components";
import { useGlobal } from "../../context/global";
import SignUp from "./tabs/signup";

export default function HomeAdmin() {
    const {tab} = useGlobal()
    return (
        <Main>
            {
                tab === 'inscripcion' &&
                <SignUp/>
            }
        </Main>
    )
}

const Main = styled.div`
width: 100%;
height: 100%;
grid-column: 3 / -1;
grid-row: 2 / -1;
`