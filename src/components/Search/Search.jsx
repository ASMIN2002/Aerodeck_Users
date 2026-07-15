import { useEffect, useRef, useState } from "react";

import "./Search.css";
import Filter from "../Filter/Filter";

function Search({

    selectedMenu

}) {

    const [showFilter, setShowFilter] = useState(false);

    const srRef = useRef(null);

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                srRef.current &&
                !srRef.current.contains(event.target)
            ) {

                setShowFilter(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);

    return (

        <div
            className="sr-container"
            ref={srRef}
        >

            <div className="sr-search-box">

                <input
                    type="text"
                    className="sr-input"
                    placeholder={`Search ${selectedMenu}...`}
                />

            </div>

            <button
                className="sr-filter-btn"
                type="button"
                onClick={() =>
                    setShowFilter(!showFilter)
                }
            >
                ⚙
            </button>

            {

                showFilter &&

                <Filter

                    selectedMenu={selectedMenu}

                />

            }

        </div>

    );

}

export default Search;