import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyLikes.css";
import { API } from "../../../services/api";

const TYPE_KEYS = ["product", "gift", "shop", "premium"];

function pickField(item, suffix, fallback = "") {
    if (!item) return fallback;
    for (const key of TYPE_KEYS) {
        const val = item[`${key}_${suffix}`];
        if (val !== undefined && val !== null) return val;
    }
    return fallback;
}

function MyLikes({ setProfilePage, onOpenDetails }) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLikes() {
            try {
                const sessionToken = localStorage.getItem("session_token");
                const res = await fetch(
                    `${API}/api/user/likes?session_token=${sessionToken}`
                );
                const data = await res.json();
                if (data.success) setLikes(data.data || []);
            } catch (err) {
                console.error("Likes fetch error:", err.message);
            } finally {
                setLoading(false);
            }
        }

        loadLikes();
    }, []);

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div className="my-likes">
            <div className="my-likes-header">
                <button className="my-likes-back" onClick={handleBack}>←</button>
                <h2>My Likes</h2>
            </div>

            {likes.length === 0 ? (
                <div className="my-likes-empty">
                    <h3>No Likes Yet</h3>
                    <p>Products you like will appear here.</p>
                </div>
            ) : (
                likes.map((item) => (
                    <div
                        key={item.product_id}
                        className="my-likes-card"
                        onClick={() => onOpenDetails?.(item, "shop")}
                    >
                        <span>{item.product_id}</span>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyLikes;