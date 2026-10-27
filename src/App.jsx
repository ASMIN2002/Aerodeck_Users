import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import Loading from "./10intro/Loading";
import Splash from "./10intro/Splash";
import Home from "./pages/Home/Home";
import Update from "./pages/Update/Update";
import AppUpdate from "./pages/Update/AppUpdate";
import Maintenance from "./pages/Home/Maintenance";
import { Toaster, toast } from "react-hot-toast";
import Login from "./10intro/login";
import { API } from "./services/api";
const USER_KEY = "user";
const LOADING_DURATION = 400;
const SESSION_TOKEN_KEY = "session_token";
const FCM_TOKEN_KEY = "fcm_token";
const getStoredUser = () => {
    try {
        const saved = localStorage.getItem(USER_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch { return null; }
};
const getSession = () =>
    sessionStorage.getItem(SESSION_TOKEN_KEY) || localStorage.getItem(SESSION_TOKEN_KEY);
const clearSession = () => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FCM_TOKEN_KEY);
};
const fetchWithTimeout = (url, opts = {}, ms = 10000) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
};
const logErr = (tag, err) => {
    if (import.meta.env.DEV) console.error(tag, err?.message);
};
const HOME_PREFIXES = ["/home", "/profile", "/offers", "/medicure", "/cart"];
const isHomePath = (path) => HOME_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const navigateRef = useRef(navigate);
    const mountedRef = useRef(true);
    const pushSetupRef = useRef(false);
    const fcmSavedRef = useRef(false);
    const [page, setPage] = useState("splash");
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading HEEPIT...");
    const [loadingDuration, setLoadingDuration] = useState(LOADING_DURATION);
    const [user, setUser] = useState(getStoredUser);
    const [checkingSession, setCheckingSession] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [updateRequired, setUpdateRequired] = useState(false);
    const [isMaintenance, setIsMaintenance] = useState(false);
    useEffect(() => { navigateRef.current = navigate; }, [navigate]);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);
    const goTo = useCallback((url, options = {}) => {
        navigateRef.current(url, options);
    }, []);
    const changePage = useCallback((nextPage) => {
        const routes = {
            splash: "/",
            login: "/login",
            home: "/home/shop",
            appupdate: "/appupdate"
        };
        setPage(nextPage);
        const route = routes[nextPage];
        if (route && location.pathname !== route) navigateRef.current(route, { replace: true });
    }, [location.pathname]);
    const saveFcmTokenToBackend = useCallback(async (retries = 5) => {
        if (!mountedRef.current) return;
        const sessionToken = getSession();
        const fcmToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (!sessionToken) return;
        if (!fcmToken) {
            if (retries > 0) setTimeout(() => saveFcmTokenToBackend(retries - 1), 1000);
            return;
        }
        if (fcmSavedRef.current) return;
        fcmSavedRef.current = true;
        try {
            await fetchWithTimeout(`${API}/api/user/save-fcm-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, fcm_token: fcmToken })
            });
        } catch (err) {
            logErr("FCM save", err);
            fcmSavedRef.current = false;
        }
    }, []);
    useEffect(() => {
        const themeKey = user?.user_id ? `theme_${user.user_id}` : "theme_guest";
        const theme = localStorage.getItem(themeKey) || "light";
        document.documentElement.setAttribute("data-theme", theme);
    }, [user?.user_id]);
    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setPage("splash");
        else if (path === "/login") setPage("login");
        else if (isHomePath(path)) setPage("home");
        else if (path === "/appupdate") setPage("appupdate");
    }, [location.pathname]);
    useEffect(() => {
        let listener;
        const setup = async () => {
            listener = await CapacitorApp.addListener("backButton", async () => {
                const canGoBack = window.history.length > 1;
                if (canGoBack) {
                    navigateRef.current(-1);
                } else {
                    await CapacitorApp.exitApp();
                }
            });
        };
        if (Capacitor.isNativePlatform()) setup();
        return () => { if (listener) listener.remove(); };
    }, []);
    useEffect(() => {
        async function setupPushNotifications() {
            if (pushSetupRef.current) return;
            pushSetupRef.current = true;
            if (!Capacitor.isNativePlatform()) return;
            try {
                let perm = await PushNotifications.checkPermissions();
                if (perm.receive === "prompt") perm = await PushNotifications.requestPermissions();
                if (perm.receive !== "granted") return;
                try {
                    await PushNotifications.createChannel({
                        id: "default",
                        name: "Default",
                        description: "Default notifications",
                        importance: 5,
                        visibility: 1,
                        sound: "default",
                        vibration: true
                    });
                } catch { }
                PushNotifications.addListener("registration", async (token) => {
                    localStorage.setItem(FCM_TOKEN_KEY, token.value);
                    fcmSavedRef.current = false;
                    await saveFcmTokenToBackend();
                });
                PushNotifications.addListener("registrationError", (err) => logErr("Push register", err));
                PushNotifications.addListener("pushNotificationReceived", (notification) => {
                    const title = notification.title || notification.data?.title || "HEEPIT";
                    const body = notification.body || notification.data?.body || "New notification";
                    toast(`${title}\n${body}`, {
                        icon: "🔔",
                        duration: 4000,
                        style: { fontSize: "13px", fontWeight: 600, maxWidth: "90vw" }
                    });
                });
                PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
                    const data = action.notification?.data;
                    if (data?.order_id) navigateRef.current("/profile/orders");
                });
                await PushNotifications.register();
            } catch (err) {
                logErr("Push setup", err);
            }
        }
        setupPushNotifications();
    }, [saveFcmTokenToBackend]);
    useEffect(() => {
        if (page === "home") saveFcmTokenToBackend();
    }, [page, saveFcmTokenToBackend]);
    useEffect(() => {
        async function checkMaintenance() {
            try {
                const res = await fetchWithTimeout(`${API}/api/founders/all-founders`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const hasUser = data.data.some((f) =>
                        (f.updatepage || "")
                            .split(",")
                            .map((p) => p.trim().toUpperCase())
                            .includes("USER")
                    );
                    if (mountedRef.current) setIsMaintenance(hasUser);
                }
            } catch (err) {
                logErr("Maintenance check", err);
            }
        }
        checkMaintenance();
    }, []);
    useEffect(() => {
        async function checkForUpdate() {
            if (!user?.user_id || page !== "home") return;
            try {
                const response = await fetchWithTimeout(`${API}/user/check-update/${user.user_id}`);
                const data = await response.json();
                if (mountedRef.current) setUpdateRequired(data.success && data.update_available === true);
            } catch (err) {
                logErr("Update check", err);
            }
        }
        checkForUpdate();
    }, [user?.user_id, page]);
    useEffect(() => {
        async function restoreSession() {
            if (page !== "splash") return;
            setShowLoading(true);
            try {
                const sessionToken = getSession();
                if (!sessionToken) {
                    changePage("login");
                    return;
                }
                const response = await fetchWithTimeout(`${API}/api/auth/check-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken })
                });
                const data = await response.json();
                if (data.success && data.authenticated && data.user?.user_id) {
                    setUser(data.user);
                    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                    if (Capacitor.isNativePlatform()) {
                        Promise.all([
                            CapacitorApp.getInfo(),
                            fetchWithTimeout(`${API}/user/app-version/${data.user.user_id}`).then((r) => r.json())
                        ]).then(async ([appInfo, versionData]) => {
                            const installedVersion = String(appInfo.version);
                            const databaseVersion = versionData.version ? String(versionData.version) : "";
                            if (databaseVersion !== installedVersion) {
                                await fetchWithTimeout(`${API}/user/update-app-version/${data.user.user_id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ version: installedVersion })
                                });
                            }
                        }).catch((err) => logErr("Version sync", err));
                    }
                    changePage("home");
                } else {
                    clearSession();
                    setUser(null);
                    changePage("login");
                }
            } catch (err) {
                logErr("Session restore", err);
            } finally {
                if (mountedRef.current) {
                    setCheckingSession(false);
                    setShowLoading(false);
                }
            }
        }
        restoreSession();
    }, [page, changePage]);
    if (isMaintenance) {
        return (
            <>
                <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
                <Maintenance />
            </>
        );
    }
    if (checkingSession && page !== "splash") return null;
    return (
        <>
            <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
            {showLoading && (
                <Loading
                    duration={loadingDuration}
                    text={loadingText}
                    onComplete={() => setShowLoading(false)}
                />
            )}
            {page === "splash" && <Splash setPage={changePage} />}
            {page === "login" && (
                <Login
                    setPage={changePage}
                    setAuthMode={() => { }}
                    onLoginSuccess={saveFcmTokenToBackend}
                />
            )}
            {page === "home" && (
                <Home
                    user={user}
                    setPage={changePage}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                    goTo={goTo}
                />
            )}
            {page === "home" && updateRequired && (
                <Update
                    user={user}
                    onCancel={() => setUpdateRequired(false)}
                    onUpdate={() => {
                        setUpdateRequired(false);
                        changePage("appupdate");
                    }}
                />
            )}
            {page === "appupdate" && <AppUpdate user={user} />}
        </>
    );
}
export default App;