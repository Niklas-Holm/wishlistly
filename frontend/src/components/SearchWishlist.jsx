import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Contact from "./Contact";
import httpClient from "../httpClient";

export default function SearchWishlist() {
    const [searchField, setSearchField] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [debouncedSearchField, setDebouncedSearchField] = useState(""); // Debounced search term

    const navigate = useNavigate(); // Initialize useNavigate

    // Debounce logic: Update the debounced value after a delay
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearchField(searchField);
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounceFn); // Cleanup timeout on change
    }, [searchField]);

    // Fetch users when debounced search field changes
    useEffect(() => {
        if (debouncedSearchField) {
            (async () => {
                try {
                    const resp = await httpClient.get(
                        `/api/search-users?searchField=${debouncedSearchField}`
                    );
                    console.log(resp.data);
                    setSearchResults(resp.data.users);
                } catch (error) {
                    console.error("An error occurred:", error);
                }
            })();
        } else {
            setSearchResults([]); // Clear results when the field is empty
        }
    }, [debouncedSearchField]);

    const handleBackClick = () => {
        navigate("/"); // Navigate to the home page
    };

    return (
        <div className="create-wish-page">
            <div className="form-container search-form">
                <form className="search-form">
                    <button
                        type="button" // Change to button type="button" to avoid form submission
                        className="form-button search-form-button"
                        onClick={handleBackClick} // Handle back navigation
                    >
                        ← Back
                    </button>
                    <div className="search-wishlist-field">
                        <div>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Name or phone number"
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                            />
                        </div>
                    </div>
                </form>
                <div className="contact-widget">
                    <h1 className="widget-header">Results</h1>
                    <div className="contact-component-container">
                        {searchResults.length > 0 ? (
                            searchResults.map((user, index) => <Contact key={index} user={user} />)
                        ) : (
                            <p>No results found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
