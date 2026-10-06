import "./App.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import TermsAndCondition from "./pages/Login/TermsAndCondition";
import Loading from "./components/Loading/Loading";
import Splash from "./pages/Splash/Splash";
import Home from "./pages/Home/Home";
import NoInternet from "./components/NoInternet/NoInternet";
import Update from "./pages/Update/Update";
import AppUpdate from "./pages/Update/AppUpdate";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login/Login";
import { API } from "./services/api";


const NAV_HISTORY_KEY = "heepit_navigation_history";

function App() {
    const navigate = useNavigate();
    const goTo = (url, options = {}) => {
        let history = [];

        try {
            const saved = localStorage.getItem(NAV_HISTORY_KEY);
            history = saved ? JSON.parse(saved) : [];
        } catch {
            history = [];
        }

        if (options.replace && history.length > 0) {
            history[history.length - 1] = {
                number: history.length,
                url: url
            };
        } else if (
            history.length === 0 ||
            history[history.length - 1].url !== url
        ) {
            history.push({
                number: history.length + 1,
                url: url
            });
        }

        localStorage.setItem(
            NAV_HISTORY_KEY,
            JSON.stringify(history)
        );

        navigate(url, options);
    };

    const location = useLocation();

    const skipHistorySaveRef = useRef(false);

    useEffect(() => {
        const path = location.pathname;

        if (path === "/" || path === "/login") {
            return;
        }

        let history = [];

        try {
            const saved = localStorage.getItem(NAV_HISTORY_KEY);
            history = saved ? JSON.parse(saved) : [];
        } catch {
            history = [];
        }

        if (skipHistorySaveRef.current) {
            skipHistorySaveRef.current = false;
            return;
        }

        if (history.length === 0 || history[history.length - 1].url !== path) {
            history.push({
                number: history.length + 1,
                url: path
            });
        }

        localStorage.setItem(
            NAV_HISTORY_KEY,
            JSON.stringify(history)
        );
    }, [location.pathname]);

    useEffect(() => {
        const handleBackButton = async () => {
            let history = [];

            try {
                const saved = localStorage.getItem(NAV_HISTORY_KEY);
                history = saved ? JSON.parse(saved) : [];
            } catch {
                history = [];
            }

            if (history.length > 1) {
                history.pop();

                history = history.map((item, index) => ({
                    number: index + 1,
                    url: item.url
                }));

                localStorage.setItem(
                    NAV_HISTORY_KEY,
                    JSON.stringify(history)
                );

                skipHistorySaveRef.current = true;

                navigate(history[history.length - 1].url);
                return;
            }

            localStorage.removeItem(NAV_HISTORY_KEY);

            await CapacitorApp.exitApp();
        };

        let listener;

        CapacitorApp.addListener(
            "backButton",
            handleBackButton
        ).then((result) => {
            listener = result;
        });

        return () => {
            if (listener) {
                listener.remove();
            }
        };
    }, [navigate]);

    const changePage = (nextPage) => {
        const routes = {
            splash: "/",
            login: "/login",
            home: "/home/shop",
            appupdate: "/appupdate"
        };
        setPage(nextPage);
        const route = routes[nextPage];
        if (route && location.pathname !== route) {
            navigate(route);
        }
    };

    useEffect(() => {
        const path = location.pathname;

        if (path === "/") {
            setPage("splash");
        } else if (path === "/login") {
            setPage("login");
        } else if (
            path === "/home/shop" ||
            path === "/home/gifts" ||
            path === "/home/cards" ||
            path.startsWith("/home/shop/product/") ||
            path.startsWith("/home/gifts/product/") ||
            path.startsWith("/home/cards/product/") ||
            path === "/profile" ||
            path.startsWith("/profile/")
        ) {
            setPage("home");
        } else if (path === "/appupdate") {
            setPage("appupdate");
        }
    }, [location.pathname]);

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
                const url = `${API}/user/check-update/${user.user_id}`;

                console.log("UPDATE CHECK URL:", url);

                const response = await fetch(url);

                console.log("UPDATE CHECK STATUS:", response.status);

                const data = await response.json();

                console.log("UPDATE CHECK RESPONSE:", data);

                if (
                    data.success &&
                    data.update_available === true
                ) {
                    console.log("🔥 UPDATE AVAILABLE");
                    setUpdateRequired(true);
                } else {
                    console.log("✅ NO UPDATE REQUIRED");
                    setUpdateRequired(false);
                }
            } catch (err) {
                console.error("UPDATE CHECK ERROR:", err);
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
            if (page !== "splash") {
                return;
            }

            setShowLoading(true);

            try {
                const sessionToken = localStorage.getItem("session_token");

                if (!sessionToken) {
                    changePage("login");
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

                    try {
                        if (!Capacitor.isNativePlatform()) {
                            console.log("Web platform - skipping version sync");
                        } else {
                            const appInfo = await CapacitorApp.getInfo();
                            const installedVersion = String(appInfo.version);

                            console.log("ACTUAL INSTALLED VERSION:", installedVersion);

                            const currentVersionResponse = await fetch(
                                `${API}/user/app-version/${data.user.user_id}`
                            );

                            const currentVersionData = await currentVersionResponse.json();

                            const databaseVersion = currentVersionData.version
                                ? String(currentVersionData.version)
                                : "";

                            console.log("DATABASE VERSION:", databaseVersion);

                            if (databaseVersion !== installedVersion) {
                                console.log("VERSION DIFFERENT - SYNCING DATABASE...");

                                const versionResponse = await fetch(
                                    `${API}/user/update-app-version/${data.user.user_id}`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            version: installedVersion
                                        })
                                    }
                                );

                                const versionData = await versionResponse.json();

                                console.log("VERSION SYNC RESULT:", versionData);
                            } else {
                                console.log("VERSION ALREADY MATCHED");
                            }
                        }
                    } catch (versionError) {
                        console.error("APP VERSION SYNC ERROR:", versionError);
                    }

                    changePage("home");
                } else {
                    localStorage.removeItem("session_token");
                    localStorage.removeItem("user");
                    changePage("login");
                }
            } catch (err) {
                console.error(err);

                if (!navigator.onLine) {
                    console.log("Offline — session preserved in localStorage");
                }
            } finally {
                setCheckingSession(false);
                setShowLoading(false);
            }
        }

        restoreSession();
    }, [page]);

    useEffect(() => {
        async function syncVersionAfterUpdate() {
            if (!user?.user_id) return;

            if (!Capacitor.isNativePlatform()) {
                return;
            }

            try {
                const appInfo = await CapacitorApp.getInfo();
                const installedVersion = String(appInfo.version);

                const currentVersionResponse = await fetch(
                    `${API}/user/app-version/${user.user_id}`
                );
                const currentVersionData = await currentVersionResponse.json();
                const databaseVersion = currentVersionData.version
                    ? String(currentVersionData.version)
                    : "";

                if (databaseVersion !== installedVersion) {
                    await fetch(`${API}/user/update-app-version/${user.user_id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ version: installedVersion })
                    });
                    console.log("✅ VERSION SYNCED AFTER UPDATE!");

                    const updateRes = await fetch(`${API}/user/check-update/${user.user_id}`);
                    const updateData = await updateRes.json();
                    if (updateData.update_available === false) {
                        setUpdateRequired(false);
                    }
                }
            } catch (err) {
                console.error("VERSION SYNC ERROR:", err);
            }
        }

        syncVersionAfterUpdate();
    }, [user, page]);

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
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500
                }}
            />

            {showLoading && (
                <Loading
                    duration={loadingDuration}
                    text={loadingText}
                    onComplete={() => setShowLoading(false)}
                />
            )}

            {page === "splash" && (
                <Splash
                    setPage={changePage}
                />
            )}

            {page === "login" && (
                <Login
                    setPage={changePage}
                    setAuthMode={setAuthMode}
                />
            )}

            {page === "terms" && (
                <TermsAndCondition
                    setPage={setPage}
                />
            )}

            {page === "home" && (
                <Home
                    user={user}
                    setPage={changePage}
                    navigateWithLoading={navigateWithLoading}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                    goTo={goTo}
                />
            )}

            {page === "home" && updateRequired && (
                <Update
                    user={user}
                    onCancel={() => {
                        setUpdateRequired(false);
                    }}
                    onUpdate={() => {
                        setUpdateRequired(false);
                        changePage("appupdate");
                    }}
                />
            )}

            {page === "appupdate" && (
                <AppUpdate user={user} />
            )}
        </>
    );
}

export default App;