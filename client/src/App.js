import React from 'react';
import './App.css';
import Calendar from './components/calendar/calendar';
import Nav from './components/Nav/Nav';
import Professor from './components/Professor/Professor';
import Login from './components/Login/Login';
import Register from './components/Register/Register'
import {BrowserRouter, Switch, Route} from 'react-router-dom';

function App() {
  return (
    <div>
     <BrowserRouter>

        <Nav />
        <Switch>
          <Route path="/" exact><Calendar/> </Route>
          <Route path="/Login"><Login/></Route>
          <Route path="/Professor"><Professor/></Route> 
          <Route path="/Register"><Register/></Route> 
        </Switch>
               
        </BrowserRouter>
    </div>
  );
}

export default App;
