import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login', { username, password });
            if (response.data.success) {
                const user_id = response.data.success['return_data'];
                localStorage.setItem('user_id', user_id);
                navigate('/');
            } else {
                setErrorMessage('Login failed: Invalid credentials');
            }
        } catch (error) {
            setErrorMessage('Login failed: ' + error.message);
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <p className="register-text">Don't have an account? <Link to="/register" className="register-link">Sign up</Link></p>
            </form>
        </div>
    );
}

export default Login;
