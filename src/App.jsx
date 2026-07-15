import { useEffect, useState } from "react";

import "./App.css";

import Splash from "./pages/Splash/Splash";
import Login from "./pages/Login/Login";
import Otp from "./pages/Login/Otp";
import Home from "./pages/Home/Home";
import Register from "./pages/Login/Register";
import NoInternet from "./components/NoInternet/NoInternet";
import { API } from "./services/api";

function App() {
    const [page, setPage] = useState("splash");

    const [user, setUser] = useState(null);

    const [authMode, setAuthMode] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {

        async function checkServer() {

            try {

                const response = await fetch(`${API}/health`);

                if (response.ok) {

                    setIsOnline(true);

                } else {

                    setIsOnline(false);

                }

            }

            catch {

                setIsOnline(false);

            }

        }

        checkServer();

        const interval = setInterval(checkServer, 5000);

        return () => clearInterval(interval);

    }, []);
    if (!isOnline) {

        return (

            <NoInternet

                onRetry={async () => {

                    try {

                        const response = await fetch(`${API}/health`);

                        setIsOnline(response.ok);

                    }

                    catch {

                        setIsOnline(false);

                    }

                }}

            />

        );

    }


    return (

        <>
            {
                page === "splash" &&
                <Splash
                    setPage={setPage}
                    setUser={setUser}
                />
            }

            {
                page === "login" &&
                <Login
                    setPage={setPage}
                    setUser={setUser}
                    setAuthMode={setAuthMode}
                />
            }

            {
                page === "otp" &&
                <Otp
                    setPage={setPage}
                    user={user}
                    setUser={setUser}
                    authMode={authMode}
                />
            }

            {
                page === "home" &&
                <Home
                    user={user}
                    setUser={setUser}
                    setPage={setPage}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                />
            }
            {
                page === "register" &&
                <Register
                    setPage={setPage}
                    setAuthMode={setAuthMode}
                />
            }
        </>
    );

}

export default App;