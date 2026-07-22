import "./MyRewards.css";

function MyRewards({

    setProfilePage

}) {

    return (

        <div className="myrewards">

            <div className="rewards-header">

                <button
                    className="rewards-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    My Rewards
                </h2>

            </div>

            <div className="reward-balance">

                <h3>
                    Reward Points
                </h3>

                <h1>
                    2,450
                </h1>

                <p>
                    Worth ₹245
                </p>

            </div>

            <div className="reward-section">

                <h3>
                    Recent Rewards
                </h3>

                <div className="reward-card">

                    <div>

                        <h4>
                            Welcome Bonus
                        </h4>

                        <p>
                            18 Jul 2026
                        </p>

                    </div>

                    <span className="reward-plus">
                        +500
                    </span>

                </div>

                <div className="reward-card">

                    <div>

                        <h4>
                            Order Cashback
                        </h4>

                        <p>
                            20 Jul 2026
                        </p>

                    </div>

                    <span className="reward-plus">
                        +250
                    </span>

                </div>

                <div className="reward-card">

                    <div>

                        <h4>
                            Redeemed
                        </h4>

                        <p>
                            22 Jul 2026
                        </p>

                    </div>

                    <span className="reward-minus">
                        -300
                    </span>

                </div>

            </div>

        </div>

    );

}

export default MyRewards;