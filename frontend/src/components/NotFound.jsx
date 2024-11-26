import React from "react";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="main">
            <Link to="/">
                <img className="NF-logo" src={logo} />
            </Link>
            <h1 className="NF-header">404 - Page Not Found</h1>
        </div>
    )
}