import React from "react";
import profile from "../assets/profile.png";
import httpClient from "../httpClient";

export default function Contact(props) {
    const profileImageUrl = props.user.profile_photo || profile;


    const handleAdd = async () => {
        const user_id = props.user.id

        const resp = await httpClient.post("/api/add-user", { user_id });
        console.log(resp)

        window.location.reload();
    }

    return (
        <div className="contact-container">
            <div className="contact-image-container">
                <img
                    className="contact-image"
                    src={profileImageUrl}
                    alt="Profile"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profile;
                    }}
                />
            </div>
            <h2 className="contact-name">{props.user.name}</h2>
            <button className="add-contact-button" onClick={handleAdd}>ADD</button>
        </div>
    );
}
