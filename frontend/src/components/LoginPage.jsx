import React, { useState } from "react";
import httpClient from "../httpClient";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const logInUser = async () => {
        console.log('Email:', email);
        console.log('Password:', password);

        try {
            const resp = await httpClient.post("http://127.0.0.1:5000/login", { email, password });
            window.location.href = '/';
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Invalid email or password');
            } else {
                console.error("An error occurred:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className="login-page">
            <div className="form-container">
                <Link to="/">
                    <img className="form-logo" src={logo} />
                </Link>
                <h1 className="form-header">Log In</h1>
                <form className="login-form">
                    <div>
                        {/* <label>Email:</label> */}
                        <input className="form-input"
                            type="text" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        {/* <label>Password:</label> */}
                        <input className="form-input" 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="form-button" type="button" onClick={logInUser}>Login</button>
                </form>
                <div className="redirect-container">
                    <a href="/register">Sign Up</a>
                    <a href="">Forgot password?</a>
                </div>
            </div>
        </div>
    );
}
