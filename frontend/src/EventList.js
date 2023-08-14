import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';


function EventList() {

  const [events, setEvents] = useState([]);

  // Fetch User id and name of logged in user
  const user_name = Cookies.get('user_name') ? Cookies.get('user_name') : 'Guest';
  const user_id = Cookies.get('user_id') ? Cookies.get('user_id') : '0';

  const navigate = useNavigate();

  // Handles like/unlike button click by user
  const handleLike = (e) => {
    // User_id = 0 means no user is currently logged in
    if (user_id == 0) {
      navigate("/login",
        { state: { message: 'Please login!!', 'user_id': user_id } }
      );
    }

    // Like button id contains event_id
    console.log(e.currentTarget.id)
    console.log('liked')
    const event_id = e.currentTarget.id;

    const like = {
      user_id,
      event_id
    }
    axios.post('http://127.0.0.1:8000/api/like/', like)  // Store the use like/unlike action for an event in database
      .then(response => {

      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });


  }

  // Fetch All the events from database along with liking history( if a user is logged in)
  const handleGlobalEvents = (e) => {
    const user = {
      user_id
    }
    axios.put('http://127.0.0.1:8000/api/events/', user)  // Update the URL as needed
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }

  // Fetch the events created by logged in user along with liking history(This option is available only when a user is logged in)
  const handleYourEvents = (e) => {
    const user = {
      user_id
    }
    axios.post('http://127.0.0.1:8000/api/yourevents/', user)  // Update the URL as needed
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }

  // Fetch All the events when the page loads along with liking details of logged in user
  useEffect(() => {
    const user = {
      user_id
    }

    axios.put('http://127.0.0.1:8000/api/events/', user)  // Update the URL as needed
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  //  *************************************** Styling added for Event List display *******************************

  const eventStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  };

  const imageStyle = {
    flex: '0 0 30%',
    maxWidth: '100px',
    marginRight: '20px',
  };

  const detailsStyle = {
    flex: '1',

  };

  const likeStyle = {
    flex: '1',
    textAlign: 'right',
  }

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'red',
  };

  const optionsStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const optionButtonStyle = {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    marginLeft: '10px',
    cursor: 'pointer',

  };

  //  *************************************** Event List display *******************************

  return (
    <div>
      <div >
        <nav class="navbar navbar-expand-lg navbar-light bg-light" style={{ padding: '0', margin: '0' }}>
          <div style={{ fontFamily: 'cursive', padding: '20px', fontWeight: 'bold', color: 'red' }}>EventBrite</div>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li>
                <button onClick={handleGlobalEvents} class="nav-link" style={{ "background-color": "transparent" }}>Global Events</button>
              </li>

              {/* Login and register options are disabled when a user is already logged in */}
              <li>
                <Link to="/register" class="nav-link" style={{ display: user_name === 'Guest' ? 'block' : 'none' }}>Register</Link>
              </li>
              <li>
                <Link to="/login" class="nav-link" style={{ display: user_name === 'Guest' ? 'block' : 'none' }}>Login</Link>
              </li>

              {/* View your Events and create new event options are only available when a user is logged in */}
              <li>
                <button onClick={handleYourEvents} class="nav-link" style={{ "background-color": "transparent", display: user_name === 'Guest' ? 'none' : 'block' }}>Your Events</button>
              </li>
              <li>
                <Link to="/createevent" class="nav-link" style={{ display: user_name === 'Guest' ? 'none' : 'block' }}>Create Event</Link>
              </li>
            </ul>
            <div class="form-inline my-2 my-lg-0" style={{ color: 'black' }}>
              <div>{user_name}</div>
            </div>
          </div>
        </nav>
      </div>

      {/* Listing the details of events fetched from the API endpoint */}
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>

        {events.map(event => (

          <form id={event.event_id} style={eventStyle}>
            <img src={event.event_img} alt={event.event_name} style={imageStyle} />
            <div class="text-dark" style={{ flex: '1' }}>
              <h3>{event.event_name}</h3>
              <p>Data: {event.event_data}</p>
              <p>Time: {event.event_time}</p>
              <p>Location: {event.event_loc}</p>
            </div>

            {/* Like Button is clickable and like/unlike action is recorded in database(white heart for unliked events and red heart for liked events) */}
            <div style={likeStyle}>
              <button style={{ "background-color": "transparent" }} type='submit' id={event.event_id} onClick={handleLike}>
                
                {event.is_liked ? (
                  <span>&#128151; </span>
                ) : (
                  <span>&#x1F90D; </span>
                )}

              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

export default EventList;


