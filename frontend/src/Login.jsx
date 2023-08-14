import React, { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Auth.css';
import axios from 'axios';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const msg = location.state?.message || '';
    
    const handleLogin = (e) => {
        e.preventDefault();
        
        console.log(email);
        console.log(password);
        const user = {
            email, password
        }

        try {
            const response = axios.post('http://localhost:8000/api/login/', user).then((response) => {
                console.log(response.data['post_result']);
                if (response.data['post_result'] == 1) {
                    console.log('Authenticated');
                    const expirationTime = new Date(new Date().getTime() + 600000);
                    Cookies.set('user_id', response.data['user_id'], { expires: expirationTime });
                    Cookies.set('user_name', response.data['user_name'], { expires: expirationTime });
                    navigate("/",
                        { state: { message: 'User Logged in successfully.', 'user_id': response.data['user_id'] } }
                    );
                } else if (response.data['post_result'] == 0) {
                    console.log('Invalid email or password.');

                    navigate('/login',
                    { state: { message: 'Invalid email or password!!'}});
                }
              })
            
            
        } 
        catch (error) {
            console.error('Error creating event:', error);
            // Display error message or perform error handling
        }

    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <h3>{msg}</h3>
            <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <p></p>
                <button type="submit">Log In</button>
            </form>
            <Link to="/register" className="link-btn">Don't have an account? Register here.</Link>
            
        </div>
    )
}

export default Login;