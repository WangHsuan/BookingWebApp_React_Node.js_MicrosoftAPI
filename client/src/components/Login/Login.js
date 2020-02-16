import React, { useState } from "react";
import './Login.css';
import { Button, Form, Input} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';



function Login() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    
    function postLogin() {
        
        var reg = JSON.stringify({Email:userName, Password: password });
        fetch('/api/login',{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:reg,
          })
          .then(res => res.json())
          .then(
            data => {
                console.log('Request succeeded with JSON response', data);
                //setAuthTokens(data);
                if(data['Status']){
                    
                    setLoggedIn(true);
                   
                }else{
                   
                   
                    setErrorMessage(data.Err);
                    
                }
                
                
                
            }
          )
          .catch(err => console.log('err'))  
          
    }
  
    if (isLoggedIn) {
      return <Redirect to="/professor" />;
    }
  
    return (
        <div className="LoginFormStyle">
            
            <Form className='formStyle'>
            <div className='formTitle'>Login</div>
            <div className="formGroup"> 
              <Input
                type="username"
                value={userName}
                onChange={e => {
                  setUserName(e.target.value);
                }}
                placeholder="Email..."
              />
              </div>
              <div className="formGroup"> 
              <Input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                }}
                placeholder="Password..."
              />
              </div>
              <div className="formGroup">
              <Button onClick={postLogin}>Login</Button>
              </div>
            </Form>
            <Link className='signup' to="/Register">Don't have an account?</Link>
            <div className='err'>{errorMessage}</div>
            <div className="formGroup">
            
            </div>
             
        </div>
          
        );
  }

export default Login;
