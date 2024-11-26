import React from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import { Link } from "react-router-dom";


export default function CreateWish() {
    // States for form fields
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get("http://127.0.0.1:5000/@me");
                setUser(resp.data);
                console.log("Authenticated user: ", resp.data);
            } catch (error) {
                console.log("Not authenticated. Please login. 401 Unauthorized error: ", error.response);
                navigate("/login");
            }  finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    if(loading) {
        return <div className="loading-page"></div>
    }

    if (user === null) {
        return <LoginPage />;
    }

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('url', url);
        if (image) {
            formData.append('image', image);
        }
    
        try {
            const response = await fetch('http://127.0.0.1:5000/api/wishes', {
                method: 'POST',
                body: formData,
                credentials: 'include', // This ensures cookies (session data) are sent with the request
            });
    
            if (!response.ok) {
                throw new Error('Error creating wish');
            }
    
            const data = await response.json();
            console.log(data);  // Log the response data to ensure it's correct
            window.location.href = '/';
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    // Handle image removal
    const handleRemoveImage = () => {
        setImage(null);
        document.getElementById('image-upload').value = '';
    };

    return (
        <div className="create-wish-page">
            <div className="form-container">
                <h1 className="profile-header">ADD A WISH</h1>
                <Link to="/" style={{ display: 'block', width: '100%' }}>
                    <button className="action-button profile-button">← BACK TO WISHLIST</button>
                </Link>
                <form className="login-form" onSubmit={handleSubmit}>
                    {/* Product Name Input */}
                    <div>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    {/* Price Input */}
                    <div>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <textarea
                            className="form-input description-input"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Product Link Input */}
                    <div>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Product Link"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* File Input Wrapper */}
                    <div className="file-input-wrapper">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />

                        {/* Custom Label Button */}
                        <label
                            htmlFor="image-upload"
                            className="custom-file-button"
                        >
                            {image ? image.name : 'Choose Product Image'}
                        </label>

                        {/* File Remove Button (X) */}
                        {image && (
                            <span
                                className="remove-file"
                                onClick={handleRemoveImage}
                            >
                                ✕
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button className="form-button" type="submit">Add Wish</button>
                </form>
            </div>
        </div>
    );
}
