import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Wish from "./Wish";
import Contact from "./Contact";
import People from "./People";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";

export default function MainApp() {
    const [wishes, setWishes] = useState([]);
    const [profile_photo, setProfilePhoto] = useState(null);
    const [users, setUsers] = useState([]);  // State for storing users data
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        // Fetch logged-in user data (including their wishes)
        const fetchUserData = async () => {
            try {
                const response = await fetch("/@me", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setWishes(data.wishes || []); // Ensure wishes is always an array
                    setProfilePhoto(data.profile_photo);
                    setLoggedInUser(data); // Store user data
                } else {
                    console.log("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Fetch all users data for contacts, limited to necessary fields
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/get_all_users", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data || []); // Ensure users is always an array
                } else {
                    console.log("Failed to fetch users data");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUserData();
        fetchUsers(); // Fetch all users when component mounts
    }, []);

    const profileImageUrl = profile_photo || profile;

    return (
        <div>
            <div className="main">
                <div className="logo-widget">
                    <img className="nav-logo" src={logo} />
                </div>
                <div className="profile-widget">
                    <Link to="/profile">
                        <img
                            className="nav-profile-image"
                            src={profileImageUrl}
                            alt="Profile"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = profile;
                            }}
                        />
                    </Link>
                </div>
                <div className="action-button-widget">
                    <Link to="/create-wish" className="action-button">
                        <button type="button" className="action-button">
                            CREATE NEW WISH
                        </button>
                    </Link>
                    <Link to="/search-wishlist" className="action-button">
                        <button type="button" className="action-button action-button-bottom">
                            FIND A WISHLIST
                        </button>
                    </Link>
                </div>
                <div className="my-wishes-widget">
                    <h1 className="widget-header">MY WISHES</h1>
                    <div className="wish-component-container">
                        {wishes.length > 0 ? (
                            wishes.map((wish) => <Wish key={wish.id} wish={wish} />)
                        ) : (
                            <p>No wishes found</p>
                        )}
                    </div>
                </div>
                <div className="contact-widget">
                    <h1 className="widget-header">RECOMMENDATIONS</h1>
                    <div className="contact-component-container">
                        {users.length > 0 ? (
                            users
                                .filter(user => 
                                    loggedInUser?.friends 
                                    && !loggedInUser.friends.includes(user.id)
                                ) // Exclude friends if friends exist
                                .map(user => (
                                    <Contact key={user.id} user={user} />
                                ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>
                </div>
                <div className="followed-list-widget">
                    <h1 className="widget-header">FOLLOWED WISHLISTS</h1>
                    <div className="followed-component-container">
                        {users.length > 0 ? (
                            users
                                .filter(user => 
                                    loggedInUser?.friends 
                                    && loggedInUser.friends.includes(user.id)
                                ) // Include friends only if friends exist
                                .map(user => (
                                    <People key={user.id} user={user} />
                                ))
                        ) : (
                            <p>No followed wishlists found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}