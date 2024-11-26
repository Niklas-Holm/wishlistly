import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import MainApp from "./MainApp";
import NotLoggedIn from "./NotLoggedIn";

const LandingPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const resp = await httpClient.get("http://127.0.0.1:5000/@me");
                setUser(resp.data);
                console.log("Authenticated user: ", resp.data);
            } catch (error) {
                console.log("Not authenticated. Please login. 401 Unauthorized error: ", error.response);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <div className="loading-page"></div>
    }

    return (
        <div>
            {user != null ? (
                <MainApp />
            ) : (
                <NotLoggedIn />
            )}
        </div>
    );
};

export default LandingPage;
    