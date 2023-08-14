import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import './App.css';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
  
class App extends Component {
render() {
    return (
    <Router>
      <div style={{backgroundColor: 'white'}}>
        <Routes>
                  <Route exact path='/' element={< EventList />}></Route>
        </Routes>
      </div>
      <div className="App">
        <Routes>
                <Route exact path='/register' element={< Register />}></Route>
                <Route exact path='/login' element={< Login />}></Route>
                <Route exact path='/createevent' element={< CreateEvent />}></Route>
        </Routes>
        </div>
    </Router>
);
}
}
  
export default App;