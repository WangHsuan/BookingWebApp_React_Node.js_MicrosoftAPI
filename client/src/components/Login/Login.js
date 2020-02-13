import React from 'react';
import './Login.css';
import { Button, Form, Label, Input} from 'reactstrap';


class Login extends React.Component{
    constructor(props){
        super(props);
    }
    
    handleSubmit = () => {

    }

    render(){
        return(
        <div className="LoginFormStyle">
            <Form onSubmit={this.handleSubmit} className='formStyle'>
            <div className="formGroup">
              <Label for="exampleEmail">Account </Label>
              <Input type="email" name="loginAccount" id="loginAccount" placeholder="Account..." />
            </div>  
            <div className="formGroup">
              <Label for="examplePassword">Password </Label>
              <Input type="text" name="Password" id="Password" placeholder="Password..." />
            </div>
              <Button >Submit</Button>
            
          </Form>
        </div>
        
        )
    }
}

export default Login;
