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
    const [checkingSession, setCheckingSession] = useState(true);
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

        interval = setInterval(checkServer, 30000);

        window.addEventListener("online", goOnline);

        window.addEventListener("offline", goOffline);

        return () => {

            clearInterval(interval);

            window.removeEventListener("online", goOnline);

            window.removeEventListener("offline", goOffline);

        };

    }, []);

    useEffect(() => {

        async function restoreSession() {

            if (page !== "startup") {
                return;
            }

            // 2. Agar localStorage me user nahi hai tab server session check karo
            try {

                const sessionToken = localStorage.getItem("session_token");

                if (!sessionToken) {

                    setPage("login");
                    return;

                }

                const response = await fetch(

                    `${API}/api/auth/check-session`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            session_token: sessionToken

                        })

                    }

                );

                const data = await response.json();
                if (data.success && data.authenticated) {

                    setUser(data.user);

                    setPage("home");

                } else {

                    if (navigator.onLine) {

                        setPage("login");

                    }

                }

            } catch (err) {
                console.error(err);
                return;
            } finally {

                setCheckingSession(false);

            }

        }

        restoreSession();

    }, [page]);
    if (!isOnline) {

        return (

            <NoInternet

                onRetry={() => {

                    window.location.reload();

                }}

            />

        );

    }
    if (checkingSession && page !== "splash") {

        return null;

    }


    return (

        <>
            {
                page === "splash" &&
                <Splash
                    setPage={setPage}
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