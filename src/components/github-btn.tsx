import styled from "styled-components";
import {GithubAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../firebase.ts";
import {useNavigate} from "react-router-dom";
import ROUTES from "../constants/routes.ts";
// import {signInWithRedirect} from "firebase/auth";

const Button = styled.span`
    margin-top: 50px;
    background-color: white;
    font-weight: 600;
    width: 100%;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    color: black;
    cursor: pointer;
`;

const Logo = styled.img`
    height: 25px;
`;
export default function GithubButton() {
    const navigate = useNavigate();
    // event handler
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider()
            await signInWithPopup(auth, provider);
            // await signInWithRedirect(auth, provider);
            navigate(ROUTES.HOME);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Button onClick={onClick}>
            <Logo src={'/github-logo.svg'}/>
            Continue with GitHub
        </Button>
    );
}