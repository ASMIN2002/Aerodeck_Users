import "./NoInternet.css";
import { MdWifiOff } from "react-icons/md";

function NoInternet({ onRetry }) {

    return (

        <div className="ni-container">

            <div className="ni-card">

                <div className="ni-icon">

                    <MdWifiOff />

                </div>

                <h1 className="ni-title">

                    No Internet Connection

                </h1>

                <p className="ni-text">

                    We couldn't connect to AERODECK.

                    <br />

                    Please check your Wi-Fi or mobile data
                    and try again.

                </p>

                <button
                    className="ni-btn"
                    onClick={onRetry}
                >

                    Retry

                </button>

                <div className="ni-version">

                    Version 1.0.0

                </div>

            </div>

        </div>

    );

}

export default NoInternet;