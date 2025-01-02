import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {FirebaseError} from "firebase/app";
import {Link, useNavigate} from "react-router-dom";
import ROUTES from "../constants/routes.ts";
import {auth} from "../firebase.ts";
import {Error, Input, Switcher, Title, Wrapper, Form} from "../components/styled/auth-styled-components.ts";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value}} = e;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if(isLoading || email === "" || password === "") {
            return;
        }
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate(ROUTES.HOME);
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.code);
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <Wrapper>
            <Title>Log into 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input name={'email'} value={email} placeholder="Email" type="email" required={true}
                       onChange={onChange}/>
                <Input name={'password'} value={password} placeholder="Password" type  ="password" required={true}
                       onChange={onChange}/>
                <Input type={'submit'} value={isLoading ? "Loading..." : "Login"}/>
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't have an account? <Link to={ROUTES.CREATE_ACCOUNT}>Create one &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}