import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center vh-100 w-100"
            style={{
                backgroundImage: 'url(farm-welcome.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}
        >
            <div className="text-center">
                <h1 className="fw-bold display-4">Welcome to the Farm Management App!</h1>
                <h2 className="fw-bold display-5">Please log in to continue</h2>
                <Link to="/login">
                    <button className="btn btn-primary mt-3">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Welcome;
