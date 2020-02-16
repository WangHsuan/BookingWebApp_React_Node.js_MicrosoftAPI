import React, { useState } from "react";
import './Register.css';
import { Button, Form, Input} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
//import { useAuth } from "../context/auth";

// class Register extends React.Component{
//     constructor(props){
//         super(props);
        
//     }
    
//     handleSubmit = (e) => {
//         e.preventDefault();
//         const email = e.target.elements.loginAccount.value;
//         const password = e.target.elements.Password.value;
//         var reg = JSON.stringify({Email:email, Password: password });
        
//         fetch('/api/register',{
//             method:'POST',
//             headers:{
//               'Content-Type':'application/json',
//             },
//             body:reg,
//           })
//           .then(res => res.json())
//           .then(
//             data => {
//                 console.log('Request succeeded with JSON response', data);
                
//             }
//           )
//           .catch(err => console.log(err))
//     }

//     render(){
//         return(
//         <div className="LoginFormStyle">
//             <Form onSubmit={this.handleSubmit} className='formStyle'>
             
//             <div className='formTitle'>Register</div>
//             <div className="formGroup">             
//               <Input type="email" name="loginAccount" id="loginAccount" placeholder="Account..." />
//             </div>  
//             <div className="formGroup">
              
//               <Input type="password" name="Password" id="Password" placeholder="Password..." />
//             </div>
//               <Button className='button'>Register</Button>
            
//           </Form>
          
//         </div>
        
//         )
//     }
// }

function Register() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    //const { setAuthTokens } = useAuth();
  
    function postLogin() {
        var reg = JSON.stringify({Email:userName, Password: password });
        fetch('/api/register',{
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
                    alert('Create Success')
                    setLoggedIn(true);
                    console.log('success');
                }else{
                    alert('Please Create Again')
                    console.log("Fail");
                }
                
                
                
            }
          )
          .catch(err => console.log('err'))  
    }
  
    if (isLoggedIn) {
      return <Redirect to="/Login" />;
    }
  
    return (
    <div className="LoginFormStyle">
        
        <Form className='formStyle'>
        <div className='formTitle'>Create an Account</div>
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
          <Button onClick={postLogin}>Sign up</Button>
          </div>
        </Form>
        <div className="formGroup">
        
        </div>
         
    </div>
      
    );
  }



export default Register;
