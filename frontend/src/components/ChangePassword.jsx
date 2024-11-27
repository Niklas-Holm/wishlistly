import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import httpClient from "../httpClient";

export default function ChangePassword () {
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [newConfirmPassword, setNewConfirmPassword] = useState('')
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(true);

    
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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from submitting and refreshing the page
    
        if (newPassword !== newConfirmPassword) {
            console.log("Passwords do not match");
            alert("Passwords do not match");
        } else {
            try {
                const resp = await httpClient.post("/change-password", { newPassword });
                alert("Password changed successfully!");
                navigate('/profile'); // Use navigate from react-router for redirection
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Invalid password');
                } else {
                    console.error("An error occurred:", error);
                    alert("An unexpected error occurred. Please try again later.");
                }
            }
        }
    };
    
    
    return (
        <div>
            <div className="create-wish-page">
            <div className="form-container">
                <h1 className="profile-header">CHANGE PASSWORD</h1>
                <Link to="/profile" style={{ display: 'block', width: '100%' }}>
                    <button className="action-button profile-button">← BACK TO PROFILE</button>
                </Link>
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Product Name Input */}
                    <div>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    {/* Price Input */}
                    <div>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Confirm new password"
                            value={newConfirmPassword}
                            onChange={(e) => setNewConfirmPassword(e.target.value)}
                        />
                    </div>
                    {/* Submit Button */}
                    <button className="form-button" type="submit">SUBMIT</button>
                </form>
            </div>
        </div>
    </div>
    )
}