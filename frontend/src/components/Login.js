import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';
import "./styles/general.css"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setToken(data.token);
            navigate('/map'); // Redirect to map page after successful login
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main">
            <h1 className="title">Login</h1>
            <div className="wrapper">
                {error && <div className="error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="usernameInput">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="inputs"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="passwordInput">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="inputs"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className="inputs" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
