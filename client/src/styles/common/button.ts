import styled from "styled-components";

const Button = styled.div`
background-color: white;
color: black;
border-radius: 10em;
font-size: 16px;
font-weight: 400;
padding: 1em 2em;
cursor: pointer;
transition: all 0.3s ease-in-out;
box-shadow: 0 5px 5px ${props => props.theme.shadow.Dark200};
&:hover {
    transform: translateY(-4px);
    box-shadow: 0 5px 7px ${props => props.theme.shadow.Dark300};
}
`
export default Button