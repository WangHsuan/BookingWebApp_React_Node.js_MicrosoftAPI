import React from 'react';
import './Login.css';
import { Button, Form, Label, Input} from 'reactstrap';


class Login extends React.Component{
    constructor(props){
        super(props);
        
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.elements.loginAccount.value;
        const password = e.target.elements.Password.value;
        var reg = JSON.stringify({Email:email, Password: password });
        
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
                
            }
          )
          .catch(err => console.log(err))
    }

    render(){
        return(
        <div className="LoginFormStyle">
            <Form onSubmit={this.handleSubmit} className='formStyle'>
             
            <div className='formTitle'>Login Form</div>
            <div className="formGroup">             
              <Input type="email" name="loginAccount" id="loginAccount" placeholder="Account..." />
            </div>  
            <div className="formGroup">
              
              <Input type="password" name="Password" id="Password" placeholder="Password..." />
            </div>
              <Button className='button'>Login</Button>
            
          </Form>
        </div>
        
        )
    }
}

export default Login;
