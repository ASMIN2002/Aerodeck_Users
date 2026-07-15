import "./Trending.css";
import TrendingCard from "../TrendingCard/TrendingCard";

function Trending() {

    return (

        <section className="tr-section">

            <div className="tr-header">

                <h2 className="tr-title">
                    Trending
                </h2>

            </div>

            <div className="tr-slider">

                <TrendingCard />

                <TrendingCard />

                <TrendingCard />

                <TrendingCard />

                <TrendingCard />

                <TrendingCard />

            </div>

        </section>

    );

}

export default Trending;