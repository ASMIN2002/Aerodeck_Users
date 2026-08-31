import Login from "./Login";
import Register from "./Register";
import "../../styles/AuthFlip.css";

function AuthFlip({
    page,
    setPage,
    setAuthMode
}) {
    const isRegister = page === "register";

    return (
        <div className="auth-container">
            <div
                className={`auth-flip-card ${
                    isRegister ? "auth-flipped" : ""
                }`}
            >
                <div className="auth-flip-side auth-login-side">
                    <Login
                        setPage={setPage}
                        setAuthMode={setAuthMode}
                    />
                </div>

                <div className="auth-flip-side auth-register-side">
                    <Register
                        setPage={setPage}
                        setAuthMode={setAuthMode}
                    />
                </div>
            </div>
        </div>
    );
}

export default AuthFlip;