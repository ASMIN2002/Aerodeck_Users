import { useEffect, useState } from "react";

import "./App.css";

import Loading from "./components/Loading/Loading";
import Splash from "./pages/Splash/Splash";
import Login from "./pages/Login/Login";
import Otp from "./pages/Login/Otp";
import Home from "./pages/Home/Home";
import Register from "./pages/Login/Register";
import NoInternet from "./components/NoInternet/NoInternet";
import Update from "./pages/Update/Update";
import { API } from "./services/api";

function App() {

    // const [page, setPage] = useState("startup");
    const [page, setPage] = useState("splash");
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading HEEPIT...");
    const [loadingDuration, setLoadingDuration] = useState(3000);
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [authMode, setAuthMode] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [isOnline, setIsOnline] = useState(true);
    const [updateRequired, setUpdateRequired] = useState(false);
    const navigateWithLoading = (
        action,
        text = "Loading HEEPIT...",
        duration = 3000
    ) => {

        setLoadingText(text);
        setLoadingDuration(duration);
        setShowLoading(true);

        setTimeout(() => {

            if (typeof action === "function") {

                action();

            }

        }, duration);

    };
    useEffect(() => {

        async function checkForUpdate() {

            if (!user?.user_id || page !== "home") {
                return;
            }

            try {

                const response = await fetch(
                    `${API}/user/check-update/${user.user_id}`
                );

                const data = await response.json();

                if (data.success && data.update_available) {
                    setUpdateRequired(true);
                }

            } catch (err) {

                console.error("Update Check Error:", err);

            }

        }

        checkForUpdate();

    }, [user, page]);

    useEffect(() => {

        let interval;

        async function checkServer() {

            try {

                const response = await fetch(`${API}/health`, {
                    method: "GET",
                    cache: "no-store"
                });

                const data = await response.json();

                console.log("HEEPIT Health:", response.status, data);

                if (response.ok && data.success === true) {

                    setIsOnline(true);

                } else {

                    setIsOnline(false);

                }

            } catch (err) {

                console.error("HEEPIT Health Check Error:", err);

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
            setShowLoading(true);
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
                setShowLoading(false);

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
                showLoading && (
                    <Loading
                        duration={loadingDuration}
                        text={loadingText}
                        onComplete={() => setShowLoading(false)}
                    />
                )
            }
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
                    navigateWithLoading={navigateWithLoading}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                />
            }
            {
                page === "home" && updateRequired &&
                <Update
                    user={user}
                    onCancel={() => {
                        setUpdateRequired(false);
                    }}
                    onUpdate={() => {
                        setUpdateRequired(false);
                        setPage("appstore");
                    }}
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