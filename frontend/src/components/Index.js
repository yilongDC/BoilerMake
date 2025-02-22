import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/general.css"

const Index = () => {
    const navigate = useNavigate();

    return (
        <div className="main">
            <h1 className="title">Welcome to the App</h1>
            <div className="wrapper">
                <button
                    onClick={() => navigate('/login')}
                    className="inputs"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="inputs"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Index;
