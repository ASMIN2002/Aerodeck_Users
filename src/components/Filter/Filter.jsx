import "./Filter.css";
function Filter({

    selectedMenu,

    filter,

    setFilter,

    categories

}) {

    if (
        selectedMenu !== "Cards" &&
        selectedMenu !== "Premium" &&
        selectedMenu !== "Gifts" &&
        selectedMenu !== "Shop"
    ) {

        return (

            <div className="fl-dropdown">

                {/* Blank for now */}

            </div>

        );

    }
    console.log("Selected Menu:", selectedMenu);

    return (

        <div className="fl-dropdown">

            {

                selectedMenu === "Cards" && (

                    <>

                        {

                            categories.map((category, index) => (

                                <button

                                    key={`${category}-${index}`}

                                    className={`fl-item ${filter.category === category ? "active" : ""}`}

                                    onClick={() =>

                                        setFilter({

                                            ...filter,

                                            category

                                        })

                                    }

                                >

                                    {category}

                                </button>

                            ))

                        }

                    </>

                )

            }

            <hr className="fl-divider" />

            <h4 className="fl-title">

                Price

            </h4>

            <button
                className={`fl-item ${filter.sort === "low" ? "active" : ""}`}
                onClick={() =>
                    setFilter({

                        ...filter,

                        sort: filter.sort === "low" ? "" : "low"

                    })
                }
            >

                Low → High

            </button>

            <button
                className={`fl-item ${filter.sort === "high" ? "active" : ""}`}
                onClick={() =>
                    setFilter({

                        ...filter,

                        sort: filter.sort === "high" ? "" : "high"

                    })
                }
            >

                High → Low

            </button>
            <hr className="fl-divider" />

            <h4 className="fl-title">

                Rating

            </h4>

            <button
                className={`fl-item ${filter.rating === 4 ? "active" : ""}`}
                onClick={() =>
                    setFilter({

                        ...filter,

                        rating: filter.rating === 4 ? 0 : 4

                    })
                }
            >

                4★ & Above

            </button>

            <button
                className={`fl-item ${filter.rating === 3 ? "active" : ""}`}
                onClick={() =>
                    setFilter({

                        ...filter,

                        rating: filter.rating === 3 ? 0 : 3

                    })
                }
            >

                3★ & Above

            </button>
            <hr className="fl-divider" />

            <h4 className="fl-title">

                Availability

            </h4>

            <button
                className={`fl-item ${filter.availableOnly ? "active" : ""}`}
                onClick={() =>
                    setFilter({

                        ...filter,

                        availableOnly: !filter.availableOnly

                    })
                }
            >

                Available Only

            </button>

        </div>

    );
}

export default Filter;