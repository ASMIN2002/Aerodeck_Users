import { useEffect, useRef, useState } from "react";
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

    onLogout

}) {

    const dropdownRef = useRef(null);
    const [version, setVersion] = useState("");
    useEffect(() => {

        async function loadVersion() {

            try {

                const response = await fetch(`${API}/app-version`);

                const data = await response.json();

                if (data.success) {

                    setVersion(data.data.version);

                }

            } catch (err) {

                console.log(err);

            }

        }

        loadVersion();

    }, []);

    useEffect(() => {

        function handleClickOutside(event) {

            if (

                dropdownRef.current &&

                !dropdownRef.current.contains(event.target)

            ) {

                setIsMenuOpen(false);

            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {

            document.removeEventListener("mousedown", handleClickOutside);

        };

    }, [setIsMenuOpen]);

    return (

        <header className="hd-header">

            <div

                className="hd-left"

                ref={dropdownRef}

            >

                {

                    selectedBottomTab === "Home" ? (

                        <>

                            <button
                                className="hd-category-btn"
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >

                                <span className="hd-category-text">

                                    {selectedMenu}

                                </span>

                                <span className="hd-category-arrow">

                                    {isMenuOpen ? "▲" : "▼"}

                                </span>

                            </button>

                            {

                                isMenuOpen &&

                                <div className="hd-dropdown">

                                    <button
                                        className="hd-dropdown-item"
                                        onClick={() => {

                                            if (isDetailsOpen) {

                                                closeDetails();

                                            }

                                            setSelectedMenu("Cards");
                                            setIsMenuOpen(false);

                                        }}
                                    >
                                        Cards
                                    </button>

                                    <button
                                        className="hd-dropdown-item"
                                        onClick={() => {

                                            if (isDetailsOpen) {

                                                closeDetails();

                                            }

                                            setSelectedMenu("Gifts");
                                            setIsMenuOpen(false);

                                        }}
                                    >
                                        Gifts
                                    </button>

                                    <button
                                        className="hd-dropdown-item"
                                        onClick={() => {

                                            if (isDetailsOpen) {

                                                closeDetails();

                                            }

                                            setSelectedMenu("Shop");
                                            setIsMenuOpen(false);

                                        }}
                                    >
                                        Shop
                                    </button>

                                </div>

                            }

                        </>

                    ) : (

                        <div className="hd-page-title">

                            {selectedBottomTab}

                        </div>

                    )

                }

            </div>

            <div className="hd-center">

                <h1 className="hd-logo">

                    AERODECK

                </h1>

                <div className="hd-version-row">

                    <span className="hd-version">

                        Version {version}

                    </span>

                    <button
                        className="hd-refresh-btn"
                        type="button"
                    >

                        ↻

                    </button>

                </div>

            </div>

            <div className="hd-right">

                <button
                    className="hd-cart-btn"
                    type="button"
                >

                    🛒

                    <span className="hd-cart-count">

                        {cartCount}

                    </span>

                </button>

            </div>

        </header>

    );

}

export default Header;