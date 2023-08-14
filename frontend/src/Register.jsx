import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Auth.css';
import axios from 'axios';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [name, setName] = useState('');
    const [mob, setMob] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(mob);
        const user = {
            name, email, password, mob
        }
        console.log(user)
        try {
            const response = axios.post('http://localhost:8000/api/users/', user).then((response) => {
                console.log(response.data['post_result']);
                if (response.data['post_result'] == 1) {
                    console.log('User registered successfully');
                    const expirationTime = new Date(new Date().getTime() + 600000);

                    Cookies.set('user_id', response.data['user_id'], { expires: expirationTime });
                    Cookies.set('user_name', response.data['user_name'], { expires: expirationTime });
                    navigate("/",
                        { state: { message: 'User registered successfully', 'user_id': response.data['user_id'] } }
                    );
                } else if (response.data['post_result'] == 0) {
                    console.log('User already exists');

                    navigate('/login',
                        { state: { message: 'User already exists!!' } });
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
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full name</label>
                <input value={name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="full Name" />
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <label htmlFor="phone">Mobile Number</label>
                <input value={mob} onChange={(e) => setMob(e.target.value)} type="tel" placeholder="Mobile number" id="mob" name="mob" />
                <p></p>
                <button className='mb-4' size='lg' type="submit">Register</button>
            </form>
            <Link to="/login" className="link-btn">Already have an account? Login here.</Link>
        </div>
    )
}

export default Register;