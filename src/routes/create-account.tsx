import {useState} from "react";
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {auth} from "../firebase.ts";
import {FirebaseError} from "firebase/app";
import {Link, useNavigate} from "react-router-dom";
import ROUTES from "../constants/routes.ts";
import {Error, Form, Input, Switcher, Title, Wrapper} from "../components/styled/auth-styled-components.ts";

// const errors = {
//     "auth/email-already-in-use": "That email already exists.",
//     "auth/weak-password" : ""
// }



export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value}} = e;
        if (name === 'name') {
            setName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if(isLoading || name === "" || email === "" || password === "") {
            return;
        }
        try {
            setLoading(true);
           const credentials = await createUserWithEmailAndPassword(auth, email, password);
           console.log(credentials.user);
           await updateProfile(credentials.user, {
               displayName: name
           });
           navigate(ROUTES.HOME);
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <Wrapper>
            <Title>Join 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input name={'name'} value={name} placeholder="Name" type="text" required={true} onChange={onChange}/>
                <Input name={'email'} value={email} placeholder="Email" type="email" required={true}
                       onChange={onChange}/>
                <Input name={'password'} value={password} placeholder="Password" type  ="password" required={true}
                       onChange={onChange}/>
                <Input type={'submit'} value={isLoading ? "Loading..." : "Create Account"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Already have an account? <Link to={ROUTES.LOGIN}>Log in &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}