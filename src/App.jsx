import { useState } from "react";

import "./App.css";

import Splash from "./pages/Splash/Splash";
import Login from "./pages/Login/Login";
import Otp from "./pages/Login/Otp";
import Home from "./pages/Home/Home";
import Register from "./pages/Login/Register";

function App() {
    const [page, setPage] = useState("splash");

    const [user, setUser] = useState(null);

    const [authMode, setAuthMode] = useState("");
    const [cartCount, setCartCount] = useState(0);

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