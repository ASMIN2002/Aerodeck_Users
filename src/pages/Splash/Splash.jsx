import { useEffect } from "react";
import "../../styles/Splash.css";

function Splash({
    setPage,
    setUser
}) {

    useEffect(() => {

        const timer = setTimeout(() => {

            const token =
                localStorage.getItem("token");

            const user =
                localStorage.getItem("user");

            if (token && user) {

                setUser(

                    JSON.parse(user)

                );

                setPage("home");

            }

            else {

                setPage("login");

            }

        }, 3200);

        return () => clearTimeout(timer);

    }, [
        setPage,
        setUser
    ]);
    return (

        <div className="sp-container">

            <div className="sp-content">

                <div className="sp-logo">
                    AD
                </div>

                <h1 className="sp-title">
                    AERODECK
                </h1>

                <p className="sp-tagline">
                    Premium Cards & Gifts
                </p>

            </div>

        </div>

    );
}

export default Splash;