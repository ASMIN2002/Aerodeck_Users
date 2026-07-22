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

        let interval;

        async function checkServer() {

            try {

                const response = await fetch(`${API}/health`, {

                    cache: "no-store"

                });

                setIsOnline(response.ok);

            }

            catch (err) {

                console.error("Health Check Error:", err);

                alert("Health Check Error: " + err);

                setIsOnline(false);

            }

        }

        function goOnline() {

            checkServer();

        }

        function goOffline() {

            setIsOnline(false);

        }

        checkServer();

        interval = setInterval(checkServer, 3000);

        window.addEventListener("online", goOnline);

        window.addEventListener("offline", goOffline);

        return () => {

            clearInterval(interval);

            window.removeEventListener("online", goOnline);

            window.removeEventListener("offline", goOffline);

        };

    }, []);
    if (!isOnline) {

        return (

            <NoInternet

                onRetry={() => {

                    window.location.reload();

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