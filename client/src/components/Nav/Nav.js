import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';


function Nav() {
  return (
    <div>
        
      <nav className='nav'>
      <h3 className ="NavTitle">Hsuan Booking Web App</h3>
          <ul className='nav-link'>
              <Link to="/">
                  <li>Calendar</li>
              </Link>
              <Link to='/Login'>
                <li>Login</li>
              </Link>
              
             
          </ul>
      </nav>
    </div>
  );
}

export default Nav;
