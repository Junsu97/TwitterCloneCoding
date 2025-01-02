import {auth} from "../firebase.ts";

export default function Home() {
    const logout = () => {
        auth.signOut();
    }
    return (
        <>
            <h1>Home!
                <button onClick={logout}>Logout</button>
            </h1>

        </>
    );
}