import React, { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    // Function to handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Function to handle removing selected image
    const handleRemoveImage = () => {
        setImage(null);
        document.getElementById('image-upload').value = '';
    };

    // Function to handle user registration
    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone_number", phoneNumber);
            if (image) {
                formData.append("image", image);
            }

            // Log the FormData before sending to verify it contains everything
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const resp = await httpClient.post("/register", formData);
            console.log("Registration successful:", resp.data);
            navigate("/"); // Redirect to login page after successful registration
        } catch (error) {
            if (error.response) {
                const errorMsg = error.response.data.error || "An unexpected error occurred.";
                if (error.response.status === 401) {
                    alert("Invalid email or password.");
                } else if (error.response.status === 409) {
                    alert("User already exists.");
                } else {
                    alert(errorMsg);
                }
            } else {
                console.error("An error occurred:", error);
                alert("A network error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="create-wish-page">
            <div className="form-container">
                <Link to="/">
                    <img className="form-logo" src={logo} alt="Logo" />
                </Link>
                <h1 className="form-header">Sign Up</h1>
                <form className="login-form" onSubmit={registerUser}>
                    {/* Image Input */}
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="image-upload" className="custom-file-button">
                            {image ? image.name : 'Choose Profile Image'}
                        </label>
                        {image && (
                            <span className="remove-file" onClick={handleRemoveImage}>
                                ✕
                            </span>
                        )}
                    </div>

                    {/* Name Input */}
                    <div>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Phone Number Input */}
                    <div>
                        <input
                            className="form-input"
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="form-button" type="submit">Sign Up</button>
                </form>

                {/* Redirect to Login */}
                <div className="redirect-container">
                    <Link to="/login">Log In</Link>
                    <a href="">Forgot password?</a>
                </div>
            </div>
        </div>
    );
}
