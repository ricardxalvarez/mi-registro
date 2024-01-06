import styled, { keyframes } from "styled-components";

export const ModalContainer = styled.div`
height: 100vh;
width: 100vw;
position: absolute;
top: 0;
left: 0;
z-index: 10;
background-color: ${props => props.theme.shadow.Dark200};
.separator {
    margin-bottom: 20px;
}
`

const showUpModal = keyframes`
    from {
        top: 100%;
    }
    to {
        top: 50%;
    }
`


export const Modal = styled.form`
min-height: 350px;
width: 70%;
max-width: 750px;
border-radius: 15px;
top: 50%;
left: 50%;
background-color: ${props => props.theme.white.White};
transform: translate(-50%, -50%);
position: absolute;
padding: 20px 25px;
animation: ${showUpModal} .3s ease forwards;
max-height: 85%;
overflow: hidden;
overflow-y: unset;
h1 {
    font-size: 22px;
    margin-bottom: 20px;
    font-weight: 500;
}
h2 {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
}
h3 {
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 500;
}
.close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    color: ${props => props.theme.gray.DarkGray};
    cursor: pointer;
}
.input-container {
    display: flex;
    align-items: end;
    gap: 5px;
    margin-bottom: 25px;
    width: 100%;
    flex-wrap: wrap;
    > div {
        flex: 1;
    }
}
.actions {
    margin-bottom: 20px;
    height: 2em;
button {
 padding: 0.8em 1.8em;
 border: 2px solid ${props => props.theme.blue.Denim};
 position: relative;
 overflow: hidden;
 background-color: transparent;
 text-align: center;
 text-transform: uppercase;
 font-size: 16px;
 transition: .3s;
 cursor: pointer;
 border-radius: 10px;
 z-index: 1;
 font-family: inherit;
 color: ${props => props.theme.blue.Denim};
 float: right;
}

> button::before {
 content: '';
 width: 0;
 height: 350%;
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%) rotate(45deg);
 background: ${props => props.theme.blue.Denim};
 transition: .5s ease;
 display: block;
 z-index: -1;
}

> button:hover::before {
 width: 110%;
}

> button:hover {
 color: ${props => props.theme.white.White};
}

}
`