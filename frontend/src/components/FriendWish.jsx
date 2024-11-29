import React, { useState } from "react";
import httpClient from "../httpClient";

export default function FriendWish(props) {
    const imageUrl = props.wish.product_photo;
    const [reserved, setReserved] = useState(props.wish.reserved)

    const handleGOTO = () => {
        const url = props.wish.product_link.startsWith("http://") || props.wish.product_link.startsWith("https://")
            ? props.wish.product_link
            : `https://${props.wish.product_link}`;

        window.open(url, "_blank");
    };

    const handleReserve = async () => {
        try {
            const response = await httpClient.post(`/api/wishes/${props.wish.id}/reserve`);
            setReserved(response.data.reserved);
            console.log("Wish reserved successfully:", response.data);
        } catch (error) {
            console.error("Error reserving wish:", error.response?.data || error.message);
        }
    };
    
    return (
        <div>
            <div className="friendwish-container">
            {reserved && <div className="card-badge">RESERVED</div>}
                <img className="contact-image friendwish-image" src={imageUrl} alt={props.wish.product_name} />
                <div className="friendwish-name-price">
                    <h2 className="friendwish-header friendwish-name">{props.wish.product_name}</h2>
                    <h2 className="friendwish-header friendwish-price">{props.wish.price}</h2>
                </div>
                <div className="friendwish-description">
                    <p>{props.wish.description}</p>
                </div>
                <div className="friendwish-buttons">
                    <button
                        className="friendwish-actionbutton"
                        onClick={handleGOTO}
                        disabled={!props.wish.product_link}
                    >
                        {props.wish.product_link ? "GOTO LINK" : "NO LINK"}
                    </button>
                    {!reserved && (
                        <button 
                            className="friendwish-actionbutton" 
                            onClick={handleReserve}
                        >
                            RESERVE
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
