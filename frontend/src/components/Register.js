import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/general.css"

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Registration successful
            console.log('Registration successful:', data);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error('Error:', err);
            setError('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main">
            <h1 className="title">Register</h1>
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
                    <div className="passwordInput">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="inputs"
                            placeholder="Confirm Password"
                            required
                        />
                    </div>
                    <button type="submit" className="inputs" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p>
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
