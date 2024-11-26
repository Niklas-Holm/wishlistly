import React from 'react'
import logo from '../assets/logo.png'
import elderly from '../assets/elderly.png'
import { Link } from 'react-router-dom'
import penIcon from '../assets/pen.png'
import checkIcon from '../assets/check.png'
import toggleIcon from '../assets/toggle.png'
import letterIcon from '../assets/letter.png'
import underline from '../assets/underline.png'

export default function NotLoggedIn() {
    return (
        <div className='main-not-authenticated'>
            <img className='NA-logo' src={logo} />

            <Link to="/register">
                <button className='action-button NA-signup-button' type="button">SIGNUP</button>
            </Link>
            <Link to="/login">
                <button className='action-button NA-login-button' type="button">LOG IN</button>
            </Link>

            <div className='NA-hero-left'>
                <h1 className='NA-hero-heading'>CREATE YOUR WISHLIST, <u>SIMPLIFIED</u></h1>
                <h2 className='NA-hero-subheading'>An easy-to-use wishlist app designed for you. Create and manage your personal wishlist with just a few taps</h2>
            </div>
            <div className='NA-hero-right'>
                <img className='NA-hero-img' src={elderly} />
            </div>
            <div className='NA-why-1'>
                <img className='NA-why-icon' src={penIcon} />
                <h4 className='NA-why-header'>SIMPLE DESIGN</h4>
                <img className='NA-why-line' src={underline}/>
                <p className='NA-why-paragraph'>Clear, easy-to-read interface that anyone can navigate.</p>
            </div>
            <div className='NA-why-2'>
                <img className='NA-why-icon' src={checkIcon} />
                <h4 className='NA-why-header'>STAY ORGANIZED</h4>
                <img className='NA-why-line' src={underline}/>
                <p className='NA-why-paragraph'>Create and manage your lists with ease, so you never forget the things that matter most.</p>
            </div>
            <div className='NA-why-3'>
                <img className='NA-why-icon' src={toggleIcon} />
                <h4 className='NA-why-header'>ESSENTIAL FEATURES</h4>
                <img className='NA-why-line' src={underline}/>
                <p className='NA-why-paragraph'>Only the functions you need, with no unnecessary distractions.</p>
            </div>
            <div className='NA-why-4'>
                <img className='NA-why-icon' src={letterIcon} />
                <h4 className='NA-why-header'>ACCESSIBLE TO ALL</h4>
                <img className='NA-why-line' src={underline}/>
                <p className='NA-why-paragraph'>Designed for seniors, making it easier to use with larger buttons and readable text.</p>
            </div>
        </div>
    )
}