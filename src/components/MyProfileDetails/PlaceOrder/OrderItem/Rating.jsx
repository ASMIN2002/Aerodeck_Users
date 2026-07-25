import "./Rating.css";

function Rating() {

    return (

        <div className="order-rating">

            <h3>Rate this Product</h3>

            <div className="rating-stars">

                <span>☆</span>
                <span>☆</span>
                <span>☆</span>
                <span>☆</span>
                <span>☆</span>

            </div>

            <button className="submit-rating">

                Submit Rating

            </button>

        </div>

    );

}

export default Rating;