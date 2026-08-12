import { useEffect, useState } from "react";
import "./UserChat.css";
import { API } from "../../services/api";
import ChatInfo from "./ChatInfo";
import ChatConfirm from "./ChatConfirm";
import ChatForm from "./ChatForm";
import ChatPayment from "./ChatPayment";



function UserChat({ orderData, setProfilePage }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [cancelled, setCancelled] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [showChatForm, setShowChatForm] = useState(false);
    const [brideName, setBrideName] = useState("");
    const [groomName, setGroomName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [motherName, setMotherName] = useState("");
    const [address, setAddress] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [showOrderChoices, setShowOrderChoices] = useState(false);


    useEffect(() => {

        const loadChatHistory = async () => {

            try {

                const sessionToken =
                    localStorage.getItem("session_token");
                if (!sessionToken) {
                    setChatHistory([]);
                    return;
                }
                const response = await fetch(
                    `${API}/api/user/chat?session_token=${sessionToken}`
                );
                const data = await response.json();
                if (data.success) {

                    console.log("CHAT MESSAGES:", data.data);

                    setChatHistory(data.data || []);

                } else {
                    setChatHistory([]);
                }
            } catch (err) {
                console.error(err);
                setChatHistory([]);
            }
        };
        loadChatHistory();
    }, []);

    const addChatMessage = async ({
        sender,
        message,
        image_url = null
    }) => {

        if (!chatId) {
            console.error("No active chat.");
            return false;
        }

        const sessionToken =
            localStorage.getItem("session_token");

        try {

            const response = await fetch(
                `${API}/api/user/chat/${chatId}/message`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        sender,
                        message,
                        image_url
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                console.error(data.message);
                return false;
            }

            return true;

        } catch (err) {

            console.error(err);
            return false;

        }
    };
    const confirmCancelOrder = async () => {

        try {

            const sessionToken =
                localStorage.getItem("session_token");

            if (!sessionToken) {
                alert("Session expired.");
                return;
            }

            if (!productId) {
                alert("Product not found.");
                return;
            }

            const response = await fetch(
                `${API}/api/user/chat/cancel`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        product_id: productId
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                alert(data.message || "Unable to cancel order.");
                return;
            }

            setChatMessages([]);
            setChatId(null);
            setProductId(null);
            setShowChatForm(false);
            setShowCardDetails(false);
            setShowOrderChoices(false);
            setCancelled(false);

            setChatHistory((prev) =>
                prev.filter(
                    (chat) => chat.product_id !== productId
                )
            );

        } catch (err) {

            console.error(err);
            alert("Unable to cancel order.");

        }
    };
    return (
        <div className="user-chat-page">

            <div className="user-chat-header">

                <button
                    className="mycart-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ← Back
                </button>

                <h2>
                    CHAT WITH AERODECK
                </h2>

                <button
                    className="user-chat-menu-btn"
                    onClick={() => setIsMenuOpen(true)}
                >
                    ☰
                </button>
            </div>
            {isMenuOpen && (

                <>
                    <div
                        className="user-chat-overlay"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <aside className="user-chat-sidebar">

                        <div className="user-chat-sidebar-header">

                            <h3>Chat History</h3>

                            <button
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ×
                            </button>

                        </div>

                        <div className="user-chat-history">

                            {chatHistory.length > 0 ? (

                                chatHistory.map((chat) => (

                                    <div
                                        key={chat.chat_id}
                                        className="user-chat-history-item"
                                        onClick={async () => {

                                            setIsMenuOpen(false);

                                            try {

                                                const sessionToken =
                                                    localStorage.getItem("session_token");

                                                const response = await fetch(
                                                    `${API}/api/user/chat/${chat.chat_id}/messages?session_token=${sessionToken}`
                                                );

                                                const data = await response.json();

                                                if (data.success) {

                                                    setChatId(chat.chat_id);
                                                    setProductId(chat.product_id);

                                                    setChatMessages(data.data || []);

                                                    const hasOrderReady = data.data?.some(
                                                        (msg) =>
                                                            msg.sender === "system" &&
                                                            msg.message === "Order Ready"
                                                    );

                                                    setShowOrderChoices(!!hasOrderReady);
                                                    setShowOrderChoices(hasOrderReady);

                                                    const detailsResponse = await fetch(
                                                        `${API}/api/user/chat/details/check?session_token=${sessionToken}&product_id=${chat.product_id}`
                                                    );

                                                    const detailsData = await detailsResponse.json();
                                                    if (detailsData.success && detailsData.exists) {
                                                        const details = detailsData.data;
                                                        setBrideName(details.bride_name || "");
                                                        setGroomName(details.groom_name || "");
                                                        setFatherName(details.father_name || "");
                                                        setMotherName(details.mother_name || "");
                                                        setAddress(details.address || "");
                                                        setAdditionalDetails(details.additional_details || "");
                                                        setShowChatForm(false);
                                                        setShowCardDetails(true);
                                                    } else {
                                                        setShowCardDetails(false);
                                                        setShowChatForm(true);
                                                    }


                                                } else {

                                                    console.error(data.message);

                                                }

                                            } catch (err) {

                                                console.error(err);

                                            }

                                        }}
                                    >

                                        <strong>
                                            {chat.product_id}
                                        </strong>

                                        <span>
                                            Order ID: {chat.order_id || "Pending"}
                                        </span>

                                    </div>

                                ))

                            ) : (

                                <div className="user-chat-no-history">
                                    No chat available.
                                </div>

                            )}
                        </div>

                    </aside>
                </>

            )}
            {chatMessages.length > 0 && (

                <div className="user-chat-history-messages">

                    {chatMessages
                        .filter((msg) => msg.message !== "Order Ready")
                        .map((msg) => (

                            <div
                                key={msg.message_id}
                                className={
                                    msg.sender === "user"
                                        ? "user-chat-history-user-message"
                                        : "user-chat-history-system-message"
                                }
                            >

                                {msg.image_url && (
                                    <img
                                        src={msg.image_url}
                                        alt="Chat"
                                        className="user-chat-history-image"
                                    />
                                )}

                                <div className="user-chat-history-message-text">
                                    {msg.message}
                                </div>

                            </div>

                        ))}

                </div>

            )}
            {orderData?.items?.length > 0 && chatMessages.length === 0 ? (

                <>
                    <ChatInfo
                        productId={orderData.items[0].product_id}
                        productName={
                            orderData.items[0].product_name ||
                            orderData.items[0].card_name ||
                            "Product"
                        }
                        productImage={
                            orderData.items[0].product_image1 ||
                            orderData.items[0].card_image1 ||
                            ""
                        }
                        quantity={orderData.items[0].quantity || 1}
                        price={
                            Number(
                                orderData.items[0].product_price ||
                                orderData.items[0].card_price ||
                                0
                            )
                        }
                    />

                    <ChatConfirm
                        onConfirm={async () => {

                            try {

                                const sessionToken =
                                    localStorage.getItem("session_token");

                                if (!sessionToken) {
                                    alert("Session expired.");
                                    return;
                                }

                                const item = orderData?.items?.[0];

                                if (!item?.product_id) {
                                    alert("Product not found.");
                                    return;
                                }
                                /* =========================
                                   1. CREATE CHAT
                                ========================= */

                                if (chatId) {
                                    console.log("Existing chat:", chatId);
                                    return;
                                }

                                const chatResponse = await fetch(
                                    `${API}/api/user/chat`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            product_id: item.product_id,
                                            order_id: orderData?.order_id || null
                                        })
                                    }
                                );

                                const chatData = await chatResponse.json();

                                if (!chatData.success) {
                                    alert(chatData.message);
                                    return;
                                }

                                const newChatId = chatData.chat_id;
                                setChatId(chatData.chat_id);
                                setProductId(item.product_id);

                                /* =========================
                                   2. SAVE PRODUCT INFO
                                ========================= */

                                const productMessage =
                                    `Product ID: ${item.product_id}\n` +
                                    `Product: ${item.product_name ||
                                    item.card_name ||
                                    "Product"
                                    }\n` +
                                    `Qty: ${item.quantity || 1}\n` +
                                    `Price: ₹${(
                                        Number(
                                            item.product_price ||
                                            item.card_price ||
                                            0
                                        ) *
                                        (item.quantity || 1)
                                    ).toFixed(2)}`;

                                await fetch(
                                    `${API}/api/user/chat/${newChatId}/message`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            sender: "system",
                                            message: productMessage,
                                            image_url:
                                                item.product_image1 ||
                                                item.card_image1 ||
                                                ""
                                        })
                                    }
                                );

                                /* =========================
                                   3. SAVE USER CONFIRM
                                ========================= */

                                await fetch(
                                    `${API}/api/user/chat/${newChatId}/message`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            sender: "user",
                                            message: "Confirm Order",
                                            image_url: null
                                        })
                                    }
                                );

                                /* =========================
                                   4. LOAD SAVED CHAT
                                ========================= */

                                const messageResponse = await fetch(
                                    `${API}/api/user/chat/${newChatId}/messages?session_token=${sessionToken}`
                                );

                                const messageData =
                                    await messageResponse.json();

                                if (messageData.success) {

                                    const formMessage =
                                        "Please provide the required details for your card.";

                                    const formResponse = await fetch(
                                        `${API}/api/user/chat/${newChatId}/message`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                session_token: sessionToken,
                                                sender: "system",
                                                message: formMessage,
                                                image_url: null
                                            })
                                        }
                                    );

                                    const formData = await formResponse.json();

                                    if (!formData.success) {
                                        console.error(
                                            "FORM MESSAGE SAVE ERROR:",
                                            formData.message
                                        );
                                    }

                                    // Form ko immediately show karo
                                    setShowChatForm(true);

                                    // Latest messages dobara load karo
                                    const updatedResponse = await fetch(
                                        `${API}/api/user/chat/${newChatId}/messages?session_token=${sessionToken}`
                                    );

                                    const updatedData = await updatedResponse.json();

                                    if (updatedData.success) {
                                        setChatMessages(updatedData.data || []);
                                    }
                                }

                                setChatHistory((prev) => [

                                    {
                                        chat_id: newChatId,
                                        product_id: item.product_id,
                                        order_id:
                                            orderData?.order_id || null
                                    },

                                    ...prev.filter(
                                        chat =>
                                            chat.chat_id !== newChatId
                                    )

                                ]);

                            } catch (err) {

                                console.error(err);
                                alert("Unable to save chat.");

                            }

                        }}

                        onCancel={() => {
                            setCancelled(true);
                        }}

                    />
                    {cancelled && (
                        <div className="user-chat-system-message">
                            Thank You! Have a good day.
                        </div>
                    )}

                </>

            ) : (

                <div className="user-chat-no-history">
                    No chat available.
                </div>

            )}
            {showChatForm && (
                <ChatForm
                    brideName={brideName}
                    setBrideName={setBrideName}
                    groomName={groomName}
                    setGroomName={setGroomName}
                    fatherName={fatherName}
                    setFatherName={setFatherName}
                    motherName={motherName}
                    setMotherName={setMotherName}
                    address={address}
                    setAddress={setAddress}
                    additionalDetails={additionalDetails}
                    setAdditionalDetails={setAdditionalDetails}
                    onSubmit={async () => {

                        try {

                            const sessionToken =
                                localStorage.getItem("session_token");



                            if (!sessionToken) {
                                alert("Session expired.");
                                return;
                            }

                            if (isEditingDetails) {

                                const response = await fetch(
                                    `${API}/api/user/chat/details`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            product_id: productId,
                                            bride_name: brideName,
                                            groom_name: groomName,
                                            father_name: fatherName,
                                            mother_name: motherName,
                                            address: address,
                                            additional_details: additionalDetails
                                        })
                                    }
                                );

                                const data = await response.json();

                                if (!data.success) {
                                    alert(data.message || "Unable to update details.");
                                    return;
                                }

                                setIsEditingDetails(false);
                                setShowChatForm(false);
                                setShowCardDetails(true);

                                return;
                            }
                            const response = await fetch(
                                `${API}/api/user/chat/details`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        session_token: sessionToken,
                                        chat_id: chatId,
                                        product_id: productId,

                                        bride_name: brideName,
                                        groom_name: groomName,
                                        father_name: fatherName,
                                        mother_name: motherName,
                                        address: address,
                                        additional_details: additionalDetails
                                    })
                                }
                            );

                            const data = await response.json();

                            if (!data.success) {
                                console.error(data.message);
                                alert(data.message || "Unable to save details.");
                                return;
                            }
                            const messageResponse = await fetch(
                                `${API}/api/user/chat/${chatId}/messages?session_token=${sessionToken}`
                            );

                            const messageData = await messageResponse.json();

                            if (messageData.success) {
                                setChatMessages(messageData.data || []);
                            }

                            setShowChatForm(false);
                            setShowCardDetails(true);

                        } catch (err) {

                            console.error("UPDATE DETAILS ERROR:", err);
                            alert(err.message || "Unable to save details.");

                        }

                    }}
                    onCancelOrder={() => {
                        setCancelled(true);
                    }}
                    cancelled={cancelled}

                    onCancelBack={() => {

                        if (isEditingDetails) {

                            setIsEditingDetails(false);
                            setShowChatForm(false);
                            setShowCardDetails(true);
                            setCancelled(false);

                            return;
                        }

                        setCancelled(false);
                    }}

                    onConfirmCancel={async () => {

                        try {

                            const sessionToken =
                                localStorage.getItem("session_token");

                            if (!sessionToken) {
                                alert("Session expired.");
                                return;
                            }

                            if (!productId) {
                                alert("Product not found.");
                                return;
                            }

                            const response = await fetch(
                                `${API}/api/user/chat/cancel`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        session_token: sessionToken,
                                        product_id: productId
                                    })
                                }
                            );

                            const data = await response.json();

                            if (!data.success) {
                                alert(data.message || "Unable to cancel order.");
                                return;
                            }

                            // Current chat screen reset
                            setChatMessages([]);
                            setChatId(null);
                            setProductId(null);
                            setShowChatForm(false);
                            setCancelled(false);

                            // Sidebar se bhi deleted chat hatao
                            setChatHistory((prev) =>
                                prev.filter(
                                    (chat) =>
                                        chat.product_id !== productId
                                )
                            );

                        } catch (err) {

                            console.error(err);
                            alert("Unable to cancel order.");

                        }

                    }}
                    isEditing={isEditingDetails}

                />
            )}
            {showCardDetails && (
                <div className="user-chat-saved-details">

                    <div className="user-chat-system-message">
                        Card Details
                    </div>

                    <div className="user-chat-detail-row">
                        <strong>Bride Name:</strong>
                        <span>{brideName}</span>
                    </div>

                    <div className="user-chat-detail-row">
                        <strong>Groom Name:</strong>
                        <span>{groomName}</span>
                    </div>

                    <div className="user-chat-detail-row">
                        <strong>Father's Name:</strong>
                        <span>{fatherName}</span>
                    </div>

                    <div className="user-chat-detail-row">
                        <strong>Mother's Name:</strong>
                        <span>{motherName}</span>
                    </div>

                    <div className="user-chat-detail-row">
                        <strong>Address:</strong>
                        <span>{address}</span>
                    </div>

                    <div className="user-chat-detail-row">
                        <strong>Additional Details:</strong>
                        <span>{additionalDetails || "—"}</span>
                    </div>

                    {!showOrderChoices && (
                        <>
                            <button
                                className="user-chat-edit-btn"
                                onClick={() => {
                                    setIsEditingDetails(true);
                                    setShowCardDetails(false);
                                    setShowChatForm(true);
                                }}
                            >
                                Edit
                            </button>

                            <div className="user-chat-action-buttons">

                                <button
                                    className="user-chat-confirm-btn"
                                    onClick={async () => {

                                        const saved = await addChatMessage({
                                            sender: "system",
                                            message: "Order Ready",
                                            image_url: null
                                        });

                                        if (!saved) {
                                            alert("Unable to save order status.");
                                            return;
                                        }

                                        setShowOrderChoices(true);

                                        const sessionToken =
                                            localStorage.getItem("session_token");

                                        const response = await fetch(
                                            `${API}/api/user/chat/${chatId}/messages?session_token=${sessionToken}`
                                        );

                                        const data = await response.json();

                                        if (data.success) {
                                            setChatMessages(data.data || []);
                                        }

                                    }}
                                >
                                    Ready to Order
                                </button>

                                <button
                                    className="user-chat-cancel-btn"
                                    onClick={() => {
                                        setCancelled(true);
                                    }}
                                >
                                    Cancel Order
                                </button>

                            </div>
                        </>
                    )}

                    {showOrderChoices && (
                        <>
                            <div className="user-chat-system-message">
                                Order Ready
                            </div>

                            <ChatPayment
                                chatId={chatId}
                                sessionToken={localStorage.getItem("session_token")}
                                productId={productId}

                                totalPrice={
                                    Number(
                                        orderData?.items?.[0]?.product_price ||
                                        orderData?.items?.[0]?.card_price ||
                                        0
                                    ) *
                                    Number(orderData?.items?.[0]?.quantity || 1)
                                }
                                quantity={Number(orderData?.items?.[0]?.quantity || 1)}
                                onPay80={() => {
                                    console.log("Pay 80%");
                                }}

                                onPayFull={() => {
                                    console.log("Pay Full Amount");
                                }}

                                onSeeDemo={() => {
                                    console.log("See Demo");
                                }}

                                onCancelOrder={() => {
                                    setCancelled(true);
                                }}
                                onCancel={() => {
                                    setCancelled(true);
                                }}

                                onConfirmCancel={confirmCancelOrder}

                            />
                        </>
                    )}

                </div>
            )}

        </div>
    );

}

export default UserChat;