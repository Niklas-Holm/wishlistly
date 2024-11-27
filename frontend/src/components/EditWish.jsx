import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { useNavigate, useParams } from "react-router-dom";
import LoginPage from "./LoginPage";
import { Link } from "react-router-dom";

export default function EditWish() {
    // States for form fields
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { wishId } = useParams();  // Get wishId from URL params
    const [loading, setLoading] = useState(true);

    // Fetch authenticated user data and existing wish details
    useEffect(() => {
        (async () => {
            try {
                // Fetch the authenticated user
                const resp = await httpClient.get("/@me");
                setUser(resp.data);
                console.log("Authenticated user: ", resp.data);

                // Fetch the wish details using GET request
                const wishResp = await httpClient.get(`/api/wishes/${wishId}`);
                const wishData = wishResp.data;

                // Populate the state with fetched wish data
                setProductName(wishData.product_name);
                setPrice(wishData.price);
                setDescription(wishData.description);
                setUrl(wishData.product_link);
                setImage(wishData.product_photo ? wishData.product_photo : null);
            } catch (error) {
                console.log("Error fetching user or wish data:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        })();
    }, [wishId, navigate]);

    if (loading) {
        return <div className="loading-page">Loading...</div>;
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

    // Handle form submission (for editing the wish)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for required fields
        if (!productName || !price || !description || !url) {
            alert("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('url', url);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch(`/api/wishes/${wishId}`, {
                method: 'PUT',  // Use PUT for updating the existing wish
                body: formData,
                credentials: 'include', // This ensures cookies (session data) are sent with the request
            });

            if (!response.ok) {
                throw new Error('Error updating wish');
            }

            const data = await response.json();
            console.log(data);  // Log the response data to ensure it's correct
            navigate('/');  // Redirect to the specific wish page after updating
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setImage(null);
        document.getElementById('image-upload').value = '';  // Reset the input field
    };

    return (
        <div className="create-wish-page">
            <div className="form-container">
                <h1 className="profile-header">EDIT WISH</h1>
                <Link to={`/`} style={{ display: 'block', width: '100%' }}>
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
                    <button className="form-button" type="submit">Update Wish</button>
                </form>
            </div>
        </div>
    );
}
