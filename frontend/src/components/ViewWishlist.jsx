import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FriendWish from "./FriendWish";
import { useNavigate } from "react-router-dom";

export default function ViewWish() {
    const { user_id } = useParams(); // Extract user_id from the URL
    const [name, setName] = useState('');
    const [wishes, setWishes] = useState([]); // State to store the fetched wishes

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user_id}/wishes`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setWishes(data.wishes)
                    setName(data.user_name)
                } else {
                    console.log("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData(); // Call the function to fetch data
    }, [user_id]); // Dependency array includes user_id


    const handleBackClick = () => {
        navigate("/")
    }
    return (
        <div className="create-wish-page">
            <div className="view-wishlist-container">
                <div className="view-wishlist-header">
                    <button
                        type="button" // Change to button type="button" to avoid form submission
                        className="form-button search-form-button"
                        onClick={handleBackClick} // Handle back navigation
                    >
                        ← Back
                    </button>
                    <h1 className="widget-header friendwish-name">{`Wishlist of ${name}`}</h1>
                </div>
                <div className="friendwish-component-container">
                    {wishes.length > 0 ? 
                    (wishes.map((wish) => (
                        <FriendWish key={wish.id} wish={wish} />
                    ))) : (
                        <p>No wishes found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
