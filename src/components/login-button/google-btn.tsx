import {Button, Logo} from "./styled-btn.ts";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {auth} from "../../firebase.ts";
import {useNavigate} from "react-router-dom";
import ROUTES from "../../constants/routes.ts";

export default function GoogleButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate(ROUTES.HOME);
        }catch (error) {
            console.error(error);
        }
    }
    return (
        <Button onClick={onClick}>
            <Logo src={'/google-logo.svg'}/>
            Continue with Google
        </Button>
    );
}