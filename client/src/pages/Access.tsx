import styled, { css } from "styled-components";
import GeneralInput from "../components/common/GeneralInput";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validate from "../utils/validate";
import * as UserValidation from '../validations/users.validation'
import UserService from "../services/user.service";
import * as UserTypes from '../types/user'
import { useGlobal } from "../context/global";
import AdminService from "../services/admin.service";

interface LoginInterface {
    username: string,
    password: string
}

export default function Access() {
    const {user, setUser} = useGlobal()
    const navigate = useNavigate()
    useEffect(() => {
        if (user) navigate('/')
    }, [user, navigate])
    const [data, setData] = useState<LoginInterface>({
        username: '',
        password: ''
    })

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.name
        const value = e.target.value
        setData(prevData => ({...prevData, [name]: value}))
    }

    async function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            validate(UserValidation.Login, data, true)
            if (data.password.length < 8) return
            const response: UserTypes.GlobalUser = await (await UserService.login(data)).data
            setUser(response)
            localStorage.setItem('user', JSON.stringify(response))
            switch (response.source) {
                case 'administrador':
                    AdminService.setToken(response.token)
                    break;
            
                default:
                    break;
            }
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Main>
            <Wrapper>
                <div className="img">
                    <img src="/assets/access.webp" alt=""/>
                </div>
                <Container onSubmit={login}>
                    <div className="owner">
                        <h4>"CENTRO EDUCATIVO CONOCIMIENTO"</h4>
                    </div>
                    <h2>Bienvenido a Mi Registro!</h2>
                    <h3>Ingresa a tu cuenta</h3>
                    <GeneralInput
                    value={data.username}
                    placeholder="Jose_perEz"
                    label="Usuario"
                    name="username"
                    required
                    onChange={onChange}
                    // darkMode
                    lightMode
                    style={{width: '90%'}}
                    />
                    <GeneralInput
                    required
                    value={data.password}
                    placeholder="min. 8 character"
                    name="password"
                    type="password"
                    onChange={onChange}
                    label="Password"
                    lightMode
                    style={{width: '90%'}}
                    />
                    <a href="/access/forgot">Olvidaste tu contraseña?</a>
                    <Login type="submit"
                    enabled={validate(UserValidation.Login, data)}
                    >Ingresar</Login>
                </Container>
            </Wrapper>
        </Main>
    )
}

const Main = styled.div`
width: 100vw;
height: 100vh;
background-color: ${props => props.theme.gray.Platinum};
position: relative;
`

const Wrapper = styled.div`
display: flex;
height: 80%;
max-height: 600px;
width: 80%;
max-width: 900px;
border-radius: 15px;
overflow: hidden;
position: absolute;
background-color: ${props => props.theme.blue.PastelBlue};
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
box-shadow: 0 5px 10px ${props => props.theme.shadow.Dark100};

.img {
    flex: 1;
    background-color: ${props => props.theme.white.White};
    position: relative;
    height: 100%;
    img {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 100%;
    }
}
` 

const Container = styled.form`
flex: 1;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
gap: 10px;
.owner {
    position: absolute;
    top: 20px;
    text-align: center;
    font-size: 14px;
    color: ${props => props.theme.gray.BlueGray}
}
h2 {
    font-size: 22px;
    font-weight: 600;
    color: ${props => props.theme.white.White};
}
h3 {
    font-size: 17px;
    font-weight: 700;
    color: ${props => props.theme.white.White};
}
a {
    align-self: flex-start;
    margin-left: 5%;
    color: ${props => props.theme.white.White};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
}
`

const Login = styled.button<{enabled: boolean}>`
display: inline-block;
padding: 12px 24px;
border: 1px solid ${props => props.theme.gray.Pewter};
border-radius: 4px;
background-color: ${props => props.theme.white.OffWhite};
transition: all 0.2s ease-in;
position: relative;
overflow: hidden;
font-size: 19px;
color: ${props => props.theme.gray.Pewter};
z-index: 1;
cursor: pointer;
&:before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%) scaleY(1) scaleX(1.25);
    top: 100%;
    width: 140%;
    height: 180%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
}
&:after {
    content: "";
    position: absolute;
    left: 55%;
    transform: translateX(-50%) scaleY(1) scaleX(1.45);
    top: 180%;
    width: 160%;
    height: 190%;
    background-color: #39bda7;
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
}
${props => props.enabled && css`
    color: #ffffff;
    border: 1px solid ${props => props.theme.blue.BlueGreen};
    &:before {
        top: -35%;
        background-color: #39bda7;
        transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
    }
    &:after {
        top: -45%;
        background-color: #39bda7;
        transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
    }
    &:active {
        transform: scale(0.8);
    }
`}
`