import "./TrackOrder.css";

function TrackOrder() {

    return (

        <div className="track-order">

            <h3 className="track-title">
                🚚 Track Order
            </h3>

            <div className="track-line">

                <div className="track-step completed">
                    <div className="track-circle"></div>
                    <span>Placed</span>
                </div>

                <div className="track-step completed">
                    <div className="track-circle"></div>
                    <span>Packed</span>
                </div>

                <div className="track-step active">
                    <div className="track-circle"></div>
                    <span>Shipped</span>
                </div>

                <div className="track-step">
                    <div className="track-circle"></div>
                    <span>Out for Delivery</span>
                </div>

                <div className="track-step">
                    <div className="track-circle"></div>
                    <span>Delivered</span>
                </div>

            </div>

        </div>

    );

}

export default TrackOrder;