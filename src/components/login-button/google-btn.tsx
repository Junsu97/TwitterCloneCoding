import {Button, Logo} from "./styled-btn.ts";
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {auth} from "../../firebase.ts";

export default function GoogleButton() {

    const onClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
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