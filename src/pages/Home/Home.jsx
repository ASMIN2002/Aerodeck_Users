import { useEffect, useState } from "react";

import "../../styles/Home.css";

import Header from "../../components/Header/Header";
import Address from "../../components/Address/Address";
import Search from "../../components/Search/Search";
import Trending from "../../components/Trending/Trending";
import Cards from "../../components/Cards/Cards";
import Gift from "../../components/Gift/Gift";
import Shop from "../../components/Shop/Shop";
import Premium from "../../components/Premium/Premium";
import Offer from "../../components/Offer/Offer";
import BottomNav from "../../components/BottomNav/BottomNav";
import Details from "../../components/Details/Details";


function Home({

    user,

    setUser,

    setPage,

    cartCount,

    setCartCount

}) {
    const [selectedMenu, setSelectedMenu] = useState(() => {

        return localStorage.getItem("selectedMenu") || "Cards";

    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [selectedBottomTab, setSelectedBottomTab] = useState(() => {

        return localStorage.getItem("selectedBottomTab") || "Home";

    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {

        localStorage.setItem("selectedMenu", selectedMenu);

    }, [selectedMenu]);

    useEffect(() => {

        localStorage.setItem("selectedBottomTab", selectedBottomTab);

    }, [selectedBottomTab]);

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("mobile_number");

        setUser(null);

        setPage("login");

    };

    const handleOpenDetails = (product, type) => {

        setSelectedProduct({

            type,

            data: product

        });

        setIsDetailsOpen(true);

    };

    const handleCloseDetails = () => {

        setSelectedProduct(null);

        setIsDetailsOpen(false);

    };

    return (

        <div className="home-container">

            <Header
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                selectedBottomTab={selectedBottomTab}
                cartCount={cartCount}
                isDetailsOpen={isDetailsOpen}
                closeDetails={handleCloseDetails}
                onLogout={handleLogout}
            />
            {
                !isDetailsOpen &&
                <Address />
            }

            {
                !isDetailsOpen &&

                (selectedBottomTab === "Home" ||

                    selectedBottomTab === "Premium") &&

                <Search
                    selectedMenu={
                        selectedBottomTab === "Home"
                            ? selectedMenu
                            : "Premium"
                    }
                />
            }

            <div className="home-content">
                {
                    isDetailsOpen &&

                    <Details
                        product={selectedProduct}
                        onBack={handleCloseDetails}
                        setCartCount={setCartCount}
                    />
                }

                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Home" &&



                    <>

                        {

                            selectedMenu === "Cards" &&

                            <>

                                <Trending />

                                <Cards
                                    setCartCount={setCartCount}
                                    onOpenDetails={handleOpenDetails}
                                />

                            </>

                        }

                        {

                            selectedMenu === "Gifts" &&

                            <Gift
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                            />

                        }

                        {
                            selectedMenu === "Shop" &&
                            <Shop
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                            />
                        }

                    </>

                }

                {

                    !isDetailsOpen &&
                    selectedBottomTab === "Premium" &&
                    <Premium
                        setCartCount={setCartCount}
                        onOpenDetails={handleOpenDetails}
                    />

                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Offers" &&

                    <Offer />
                }

            </div>

            <BottomNav

                selectedBottomTab={selectedBottomTab}

                setSelectedBottomTab={setSelectedBottomTab}

                isDetailsOpen={isDetailsOpen}

                closeDetails={handleCloseDetails}

            />

        </div>

    );

}

export default Home;