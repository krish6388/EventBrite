import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Auth.css';
import axios from 'axios';

export const CreateEvent = (props) => {
    const [event_time, setTime] = useState('');
    const [event_img, setImage] = useState(null);
    const [event_name, setName] = useState('');
    const [event_data, setData] = useState('');
    const [event_loc, setLocation] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        const user_id = Cookies.get('user_id')? Cookies.get('user_id') : '0';
        if(user_id == '0'){
            // Redirect to login page
            navigate('/login',
                    { state: { message: 'Your session has expired. Please login again!!'}});
        }

        
        const formData = new FormData();
        formData.append('event_name', event_name);
        formData.append('event_time', event_time);
        formData.append('event_data', event_data);
        formData.append('event_loc', event_loc);
        formData.append('user_id', user_id);
        formData.append('event_img', event_img);
        
        try {

            const response = axios.post('http://localhost:8000/api/events/', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }).then((response) => {
            console.log(response.data['post_result']);

            if (response.data['post_result'] == 1) {
                    console.log('New event is added.');
                    navigate("/",
                        { state: { message: 'New event is added successfully' } }
                    );
                } else if (response.data['post_result'] == 0) {
                    console.log('Error in adding the event.');
                    navigate('/createEvent');
                }
                else{
                    navigate("/",
                        { state: { message: 'New event is added successfully' } }
                    );
                }

              })
            
        } catch (error) {
            
            console.error('Error creating event:', error);
            navigate("/",
                        { state: { message: 'New event is added successfully' } }
                    );
        }
        
    }

    return (
        <div className="auth-form-container">
            <h2>Create new Event</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Event name</label>
            <input value={event_name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="event Name" />

            <label htmlFor="email">time</label>
            <input value={event_time} onChange={(e) => setTime(e.target.value)}type="datetime-local" placeholder="" id="time" name="time" />

            <label htmlFor="image">image</label>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" accept="image/*" placeholder="image" id="image" name="image" />
            
            <label htmlFor="location">location</label>
            <input value={event_loc} onChange={(e) => setLocation(e.target.value)} type="location" placeholder="location" id="location" name="location" />
            
            <label htmlFor="data">data</label>
            <input value={event_data} onChange={(e) => setData(e.target.value)} type="Description" placeholder="Event Description" id="data" name="data" />
            
            <p></p>
            
            <button className='mb-4' size='lg' type="submit">Create Event</button>
        </form>
    </div>
    )

    }
export default CreateEvent;