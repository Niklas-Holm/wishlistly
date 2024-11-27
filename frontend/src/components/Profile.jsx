import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoginPage from "./LoginPage";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logoutUser = async () => {
        await httpClient.post("/logout");
        window.location.href = "/";
    };

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get("/@me");
                setUser(resp.data);
                console.log("Authenticated user: ", resp.data);
            } catch (error) {
                console.log("Not authenticated. Please login. 401 Unauthorized error: ", error.response);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    const handleChangeProfilePic = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                await httpClient.post("/api/upload-profile-photo", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Profile picture updated successfully!");
                setUser((prevUser) => ({
                    ...prevUser,
                    profile_photo: file.name, // Update profile photo URL if needed
                }));
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                alert("Failed to update profile picture.");
            }
        }
    };

    const triggerFileInput = () => {
        document.getElementById("profile-pic-input").click();
    };

    if (loading) {
        return <div className="loading-page"></div>;
    }

    if (user === null) {
        return <LoginPage />;
    }

    return (
        <div>
            <div className="profile-main">
                <div className="profile-container">
                    <h1 className="profile-header">PROFILE PAGE</h1>
                    <Link to="/" style={{ display: "block", width: "100%" }}>
                        <button className="action-button profile-button">← BACK TO WISHLIST</button>
                    </Link>
                    <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-pic-input"
                    onChange={handleChangeProfilePic}
                    />
                    <label htmlFor="profile-pic-input">
                    <button className="action-button profile-button" onClick={triggerFileInput}>CHANGE PROFILE PICTURE</button>
                    </label>

                    <Link to="/change-password" style={{ display: "block", width: "100%" }}>
                        <button className="action-button profile-button">CHANGE PASSWORD</button>
                    </Link>
                    <button className="action-button profile-button" onClick={logoutUser}>LOG OUT</button>
                </div>
            </div>
        </div>
    );
}
