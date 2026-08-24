import { useEffect, useRef, useState } from "react";
import { API } from "../../services/api";
import "./Header.css";

function Header({
    selectedMenu,
    setSelectedMenu,
    setIsMenuOpen,
    setSelectedBottomTab,
    isDetailsOpen,
    closeDetails,
    userId
}) {
    const dropdownRef = useRef(null);
    const [version, setVersion] = useState("");

    useEffect(() => {
        async function loadVersion() {
            try {
                const response = await fetch(
                    `${API}/user/app-version/${userId}`
                );

                const data = await response.json();

                if (data.success) {
                    setVersion(data.version);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (userId) {
            loadVersion();
        }
    }, [userId]);

    const handleTabClick = (menu) => {

        if (isDetailsOpen) {
            closeDetails();
        }
        setSelectedBottomTab("Home");

        setSelectedMenu(menu);

        setIsMenuOpen(false);
    };

    return (
        <header className="hd-header" ref={dropdownRef}>

            {/* TOP ROW */}
            <div className="hd-top-row">


                <div className="hd-center">
                    <div className="hd-brand-name">
                        HEEPIT
                    </div>

                    <div className="hd-version">
                        v {version ? version : "27.03.01"}
                    </div>
                </div>




                {/* TABS */}
                <div className="hd-tabs">

                    {/* PRODUCTS */}
                    <button
                        type="button"
                        className={`hd-tab ${selectedMenu === "Shop"
                            ? "hd-tab-active"
                            : ""
                            }`}
                        onClick={() => handleTabClick("Shop")}
                    >
                        Products
                    </button>

                    {/* GIFTS */}
                    <button
                        type="button"
                        className={`hd-tab ${selectedMenu === "Gifts"
                            ? "hd-tab-active"
                            : ""
                            }`}
                        onClick={() => handleTabClick("Gifts")}
                    >
                        Gifts
                    </button>

                    {/* CARDS */}
                    <button
                        type="button"
                        className={`hd-tab ${selectedMenu === "Cards"
                            ? "hd-tab-active"
                            : ""
                            }`}
                        onClick={() => handleTabClick("Cards")}
                    >
                        Cards
                    </button>

                </div>
            </div>

        </header>
    );
}

export default Header;