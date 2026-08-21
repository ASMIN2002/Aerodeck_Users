import { useEffect, useRef, useState } from "react";
import HEEPITLOGO from "../../assets/HEEPITLOGO.png";
import { API } from "../../services/api";
import "./Header.css";

function Header({
    selectedMenu,
    setSelectedMenu,
    isMenuOpen,
    setIsMenuOpen,
    selectedBottomTab,
    cartCount,
    isDetailsOpen,
    closeDetails,
    onLogout,
    onOpenCart,
    onOpenChat,
    profilePage,
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

    // App open hote hi SHOP selected
    useEffect(() => {
        if (!selectedMenu) {
            setSelectedMenu("Shop");
        }
    }, [selectedMenu, setSelectedMenu]);

    const handleTabClick = (menu) => {
        if (isDetailsOpen) {
            closeDetails();
        }

        setSelectedMenu(menu);
        setIsMenuOpen(false);
    };

    const handleRefresh = () => {
        window.location.reload();
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
                        {version ? version : "27.03.01"}
                    </div>
                </div>

                {/* RIGHT - REFRESH */}
                <div className="hd-right">

                    <button
                        className="hd-refresh-btn"
                        type="button"
                        onClick={handleRefresh}
                        aria-label="Refresh"
                    >
                        ↻
                    </button>

                </div>

            </div>

            {/* TABS */}
            <div className="hd-tabs">

                {/* PRODUCTS */}
                <button
                    type="button"
                    className={`hd-tab ${
                        selectedMenu === "Shop"
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
                    className={`hd-tab ${
                        selectedMenu === "Gifts"
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
                    className={`hd-tab ${
                        selectedMenu === "Cards"
                            ? "hd-tab-active"
                            : ""
                    }`}
                    onClick={() => handleTabClick("Cards")}
                >
                    Cards
                </button>

            </div>

        </header>
    );
}

export default Header;