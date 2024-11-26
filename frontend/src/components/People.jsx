import React from "react";
import httpClient from "../httpClient";
import profile from "../assets/profile.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function People (props) {
    const navigate = useNavigate()
    const profileImageUrl = props.user.profile_photo
        ? `http://127.0.0.1:5000/uploads/${props.user.profile_photo}`
        : profile;


    const handleRemove = async () => {
        const user_id = props.user.id

        const resp = await httpClient.post("http://127.0.0.1:5000/api/remove-user", { user_id });
        console.log(resp)

        window.location.reload();
    }

    const handleView = async () => {
        navigate(`/view-wishlist/${props.user.id}`)
    }

    return (
        <div className="people-container">
            <div className="people-image-container">
                <img className="people-image" src={profileImageUrl} />
            </div>
            <h2 className="people-name">{props.user.name}</h2>
            <div className="people-info-text">
                <button className="view-people-button" onClick={handleView} type="button">
                    VIEW
                </button>
                <button className="delete-people-button" type="button" onClick={handleRemove}>
                    DELETE
                </button>
            </div>
        </div>
    )
}