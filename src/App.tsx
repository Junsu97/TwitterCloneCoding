import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import styled, {createGlobalStyle} from "styled-components";
import reset from "styled-reset";
import {useEffect, useState} from "react";
import LoadingScreen from "./components/loading-screen.tsx";
import {auth} from "./firebase.ts";
import ROUTES from "./constants/routes.ts";
import ProtectedRoute from "./components/protected-route.tsx";

const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
            {
                index: true, // 기본 경로("/")에서 이동
                element: <Home />, // Home 컴포넌트를 렌더링
            },
            {
                path: ROUTES.HOME,
                element: <Home />,
            },
            {
                path: ROUTES.PROFILE,
                element: <Profile />,
            },
        ],
    },
    {
        path: ROUTES.LOGIN,
        element: <Login />,
    },
    {
        path: ROUTES.CREATE_ACCOUNT,
        element: <CreateAccount />,
    },
]);
const GlobalStyles = createGlobalStyle`
    ${reset};
    * {
        box-sizing: border-box;
    }
    body {
        background-color: black;
        color:white;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    ::-webkit-scrollbar {
        display:none;
    }
`;

const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
`;

function App() {
    const [isLoading, setLoading] = useState(true);
    const init = async () => {
        await auth.authStateReady();
        // wait for firebase
        setLoading(false);
    }
    useEffect(() => {
        init();
    },[]);
    return (
        <Wrapper>
            <GlobalStyles/>
            {isLoading ? <LoadingScreen/> : <RouterProvider router={router}/>}
        </Wrapper>
    )
}

export default App
