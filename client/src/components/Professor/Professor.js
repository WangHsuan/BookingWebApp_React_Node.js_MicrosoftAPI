import React from 'react';
import './Professor.css';
import { Form,FormGroup,Label,Input,Button } from 'reactstrap';




class Professor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            events: [],
            Mon:[],
            tuesday:[],
            wednesday:[],
            thursday:[],
            friday:[]
          };
    }
    handleSubmit = e =>{
       
        e.preventDefault();
        //monday----------------------
        let monday_start = e.target.elements.monday_start.value;
        let monday_end = e.target.elements.monday_end.value;
        let mondayList = this.state.Mon;
        mondayList.push(monday_start);
        mondayList.push(monday_end);
        this.setState({monday: mondayList})
        
        // //tuesday----------------------
        let tuesday_start = e.target.elements.tuesday_start.value;
        let tuesday_end = e.target.elements.tuesday_end.value;
        let tuesdayList = this.state.tuesday;
        tuesdayList.push(tuesday_start);
        tuesdayList.push(tuesday_end);
        this.setState({tuesday: tuesdayList})
        
        // // //wednesday---------------------
        let wednesday_start = e.target.elements.wednesday_start.value;
        let wednesday_end = e.target.elements.wednesday_end.value;
        let wednesdayList = this.state.wednesday;
        wednesdayList.push(wednesday_start);
        wednesdayList.push(wednesday_end);
        this.setState({wednesday: wednesdayList})
        //Thursday-----------------------------
        let thursday_start = e.target.elements.thursday_start.value;
        let thursday_end = e.target.elements.thursday_end.value;
        let thursdayList = this.state.thursday;
        thursdayList.push(thursday_start);
        thursdayList.push(thursday_end);
        this.setState({thursday: thursdayList})
        //Friday-------------------------------
        let friday_start = e.target.elements.friday_start.value;
        let friday_end = e.target.elements.friday_end.value;
        let fridayList = this.state.friday;
        fridayList.push(friday_start);
        fridayList.push(friday_end);
        this.setState({friday: fridayList})
        
        //post data to node.js
        var businessTime = JSON.stringify({'business_time':{
            Start:[this.state.Mon[0],this.state.tuesday[0],this.state.wednesday[0],this.state.thursday[0],this.state.friday[0]],
            End:[this.state.Mon[1],this.state.tuesday[1],this.state.wednesday[1],this.state.thursday[1],this.state.friday[1]],
          }});

        fetch('/api/getBusinessTime',{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:businessTime,
          })
          .then(res => res.json())
          .then(
            data => {
                console.log('Request succeeded with JSON response', data);
                window.location.reload(false);
            }
          )
          .catch(err => console.log(err))
    }
    render(){
        const timeList = [9,10,11,12,13,14,15,16,17]
        const timeListVerse =[17,9,10,11,12,13,14,15,16]
        return(
            <div>
                <Form className ='WeekStyle' onSubmit={this.handleSubmit}>
                <h3 className='ProfessorTitle'>Manage Your Opening Time</h3>
                
                <FormGroup>
                    <Label for="Monday">Monday</Label>
                    <Input type="select" name="monday_start" >
                        {timeList.map(time=><option key={`monday_start_${time}`}>{time}</option>)}  
                    </Input>
                    <Input type="select" name="monday_end" >
                        {timeListVerse.map(time=><option key={`monday_end_${time}`}>{time}</option>)}  
                    </Input>
                    </FormGroup>

                    <FormGroup>
                    <Label for="Tuesday">Tuesday</Label>
                    <Input type="select" name="tuesday_start" >
                        {timeList.map(time=><option key={`tuesday_start_${time}`}>{time}</option>)}  
                    </Input>
                    <Input type="select" name="tuesday_end" >
                        {timeListVerse.map(time=><option key={`tuesday_end_${time}`}>{time}</option>)}  
                    </Input>
                    </FormGroup>

                    <FormGroup>
                    <Label for="Wednesday">Wednesday</Label>
                    <Input type="select" name="wednesday_start" >
                        {timeList.map(time=><option key={`wednesday_start_${time}`}>{time}</option>)}  
                    </Input>
                    <Input type="select" name="wednesday_end" >
                        {timeListVerse.map(time=><option key={`wednesday_end_${time}`}>{time}</option>)}  
                    </Input>
                    </FormGroup>

                    <FormGroup>
                    <Label for="Thursday">Thursday</Label>
                    <Input type="select" name="thursday_start" >
                        {timeList.map(time=><option key={`thursday_start_${time}`}>{time}</option>)}  
                    </Input>
                    <Input type="select" name="thursday_end" >
                        {timeListVerse.map(time=><option key={`thursday_end_${time}`}>{time}</option>)}  
                    </Input>
                    </FormGroup>

                    <FormGroup>
                    <Label for="Friday">Friday</Label>
                    <Input type="select" name="friday_start" >
                        {timeList.map(time=><option key={`friday_start_${time}`}>{time}</option>)}  
                    </Input>
                    <Input type="select" name="friday_end" >
                        {timeListVerse.map(time=><option key={`friday_end_${time}`}>{time}</option>)}  
                    </Input>
                    </FormGroup>
                    <Button className='ProfessorBtn'>Submit</Button>
                </Form>
            </div>
        )
    }
}

export default Professor;
