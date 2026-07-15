import { useEffect, useState } from "react";
import { API } from "../../services/api";

import "./Offer.css";

function Offer() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState({});
    const [now, setNow] = useState(Date.now());

    useEffect(() => {

        const fetchOffers = async () => {

            try {

                const res = await fetch(`${API}/api/user/offers`);

                const data = await res.json();

                if (data.success) {

                    setOffers(data.data);

                    const images = {};

                    data.data.forEach((offer) => {

                        images[offer.offer_id] = 0;

                    });

                    setCurrentImage(images);

                }

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        fetchOffers();

    }, []);

    useEffect(() => {

        const timer = setInterval(() => {

            setNow(Date.now());

        }, 1000);

        return () => clearInterval(timer);

    }, []);
    const getRemainingTime = (expiredAt) => {

        const diff = new Date(expiredAt).getTime() - now;

        if (diff <= 0) {

            return {

                expired: true,

                days: 0,

                hours: 0,

                minutes: 0,

                seconds: 0

            };

        }

        return {

            expired: false,

            days: Math.floor(diff / (1000 * 60 * 60 * 24)),

            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),

            minutes: Math.floor((diff / (1000 * 60)) % 60),

            seconds: Math.floor((diff / 1000) % 60)

        };

    };
    useEffect(() => {

        if (offers.length === 0) return;

        const interval = setInterval(() => {

            setCurrentImage((prev) => {

                const next = { ...prev };

                offers.forEach((offer) => {

                    const images = [
                        offer.offer_image1,
                        offer.offer_image2,
                        offer.offer_image3
                    ].filter(img => img);

                    next[offer.offer_id] =
                        ((prev[offer.offer_id] || 0) + 1) % images.length;

                });

                return next;

            });

        }, 2500);

        return () => clearInterval(interval);

    }, [offers]);

    if (loading) {

        return (

            <div className="offer-loading">

                Loading Offers...

            </div>

        );

    }

    return (

        <div className="offer-container">

            {

                offers.map((offer) => {

                    const images = [
                        offer.offer_image1,
                        offer.offer_image2,
                        offer.offer_image3
                    ].filter(Boolean);

                    const activeIndex = currentImage[offer.offer_id] || 0;
                    const timer = getRemainingTime(offer.offer_expired_at);

                    return (

                        <div
                            className="offer-card"
                            key={offer.offer_id}
                        >
                            <div className="offer-slider">

                                <img
                                    key={activeIndex}
                                    src={images[activeIndex]}
                                    alt={offer.offer_name}
                                    className="offer-image"
                                />
                                {
                                    offer.offer_highlight_text &&
                                    <div className="offer-floating-highlight">
                                        {offer.offer_highlight_text}
                                    </div>
                                }

                                <div className={`offer-status ${offer.offer_status ? "active" : "inactive"}`}>
                                    {offer.offer_status ? "Available" : "Expired"}
                                </div>

                                <div className="offer-discount-ribbon">
                                    {offer.offer_discount_percentage}% OFF
                                </div>
                                <div className="offer-dots">

                                    {

                                        images.map((_, index) => (

                                            <span
                                                key={index}
                                                className={`offer-dot ${activeIndex === index ? "active" : ""}`}
                                            />

                                        ))

                                    }

                                </div>

                            </div>

                            <div className="offer-content">

                                {

                                    offer.offer_highlight_text &&

                                    <div className="offer-highlight">

                                        {offer.offer_highlight_text}

                                    </div>

                                }

                                <h2 className="offer-name">

                                    {offer.offer_name}

                                </h2>

                                <p className="offer-description">

                                    {offer.offer_description}

                                </p>

                                <div className="offer-price-row">

                                    <span className="offer-demo-price">

                                        ₹{offer.offer_demo_price}

                                    </span>

                                    <span className="offer-discount">

                                        {offer.offer_discount_percentage}% OFF

                                    </span>

                                </div>

                                <div className="offer-final-price">

                                    ₹{offer.offer_price}

                                    <span>/ Piece</span>

                                </div>
                                {
                                    !timer.expired ? (

                                        <div className="offer-countdown">

                                            <span className="offer-clock">

                                                ⏰ Ends In

                                            </span>

                                            <div className="offer-time-box">

                                                <div>

                                                    <strong>{timer.days}</strong>

                                                    <small>Days</small>

                                                </div>

                                                <div>

                                                    <strong>{timer.hours}</strong>

                                                    <small>Hours</small>

                                                </div>

                                                <div>

                                                    <strong>{timer.minutes}</strong>

                                                    <small>Min</small>

                                                </div>

                                                <div>

                                                    <strong>{timer.seconds}</strong>

                                                    <small>Sec</small>

                                                </div>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="offer-expired">

                                            Offer Expired

                                        </div>

                                    )
                                }

                                <button className="offer-button">

                                    Explore Offer

                                </button>

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}

export default Offer;