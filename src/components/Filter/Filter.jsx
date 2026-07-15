import "./Filter.css";

function Filter({

    selectedMenu

}) {

    if (selectedMenu !== "Cards") {

        return (

            <div className="fl-dropdown">

                {/* Blank for now */}

            </div>

        );

    }

    return (

        <div className="fl-dropdown">

            <button className="fl-item">

                All Categories

            </button>

            <button className="fl-item">

                Wedding

            </button>

            <button className="fl-item">

                Birthday

            </button>

            <button className="fl-item">

                Greeting

            </button>

        </div>

    );

}

export default Filter;