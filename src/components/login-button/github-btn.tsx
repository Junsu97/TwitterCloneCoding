import {GithubAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../firebase.ts";
import {useNavigate} from "react-router-dom";
import ROUTES from "../../constants/routes.ts";
import {Button, Logo} from "./styled-btn.ts";
// import {signInWithRedirect} from "firebase/auth";


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