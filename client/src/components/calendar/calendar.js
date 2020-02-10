import React from 'react';
import {format,addDays,startOfWeek,addWeeks,subWeeks,addMinutes} from 'date-fns';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';


class Calendar extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
            fetchday:[],
            subject:'IFN 701 Project'
        };
    }
    componentDidMount(){
      fetch('api/getEvents')
      .then(res => res.json())
      .then(fetchday => 
        this.setState({fetchday}))
    }

    renderHeader(){
        
        return (
                    <div className="header row flex-middle">
                    <div className="col col-start">
                        <div className="icon" onClick={this.prevWeek}>
                        chevron_left
                        </div>
                    </div>
                    <div className="col col-center">   
                        <span>{format(this.state.currentMonth, 'yyyy wo')} Week</span>
                    </div>
                    <div className="col col-end" onClick={this.nextWeek}>
                        <div className="icon">chevron_right</div>
                    </div>
                    </div>
        );
    }
    //第一排render 時間
    //第二排 render time slot
    renderDays(){
        const dateFormat = "MMM dd eee";
        const days = [];
        let startDate = startOfWeek(this.state.currentMonth);       
          for (let i = 1; i < 6; i++) {
            if(i === 0){
              //第一排
              days.push(
                <div key={format(addDays(startDate, i), "MM-dd")} >
                <div className="col col-center title" key={i}>
                  Time
                </div>                
                {this.renderTime(format(addDays(startDate, i), "MM-dd"))}               
                </div>                
              );
            }
            else{
              days.push(
                <div key={format(addDays(startDate, i), "MM-dd")} >
                <div className="title " key={i}>
                  {format(addDays(startDate, i), dateFormat)}
                </div>
                
                {this.renderCells(format(addDays(startDate, i), "MM-dd"))}
               
                </div>                
              );
            }
          }
            
        return <div className="days row">{days}</div>;
    }
    renderCells(current_day) {      
      const timeFormat = 'kk:mm'
      let minutes = 0;
      let time=[];
      
      for(let i=0;i<17;i++){
        //從早上九點開始
        const currentTime = format(addMinutes(new Date(2019, 1, 1, 9, 0), minutes), timeFormat);
        time.push(<div  className={this.renderClass(`${current_day} ${currentTime}`)}
        key={`${current_day} ${currentTime}`} id={`${current_day} ${currentTime}`} onClick={() => {this.onDateClick(`${current_day} ${currentTime}`); }}>             
              {currentTime}              
       </div>);
      //Time Slot
      minutes+=30;
      }
      
      return time
      }

    renderClass = day =>{

      //click Time---------------------
      const clickMonth = day.slice(0,2);
      const clickDay = day.slice(3,5);
      const clickTime = day.slice(6,8);
      //current Time-------------------
      const dateFormat = "MM-dd kk:mm";
      const currentDate = format(new Date(), dateFormat);
      const currentMonth = currentDate.slice(0,2)
      const currentDay = currentDate.slice(3,5)
      const currentTime = currentDate.slice(6,8)

      let stringClass = `calendar body cell `;
      if(day === this.state.selectedDate){
        stringClass += "selected";
      }

      const reg = /[a-zA-Z]/g;
      
      this.state.fetchday.map(date =>{        
        if(day=== date.Start.slice(6,date.Start.length-1).replace(reg," ")){
          stringClass += ` selected`;
        }
        if((clickMonth === currentMonth)&&(clickDay === currentDay)&&(clickTime<=currentTime)){
          stringClass = `calendar body cell unavailable`;
        }
      }
      )
        

      return stringClass;
    }
    

    onDateClick = day => {
      //click Time---------------------
      const clickMonth = day.slice(0,2);
      const clickDay = day.slice(3,5);
      const clickTime = day.slice(6,8);
      //current Time-------------------
      const dateFormat = "MM-dd kk:mm";
      const currentDate = format(new Date(), dateFormat);
      const currentMonth = currentDate.slice(0,2)
      const currentDay = currentDate.slice(3,5)
      const currentTime = currentDate.slice(6,8)
      const className = document.getElementById(day).className;

      //if timeSlot is red, it will alert plz choose another day
      if(className === "calendar body cell  selected" ){
        alert('Please choose another day');
        this.setState({selectedDate: ''});
      }else{
        //if time is past, it will alert plz choose another day
        if((clickMonth === currentMonth)&&(clickDay === currentDay)&&(clickTime<=currentTime)){
          this.setState({selectedDate: ''});
          alert('Please choose another day')
        }
       
        if((clickMonth <= currentMonth)&&(clickDay < currentDay)){
          this.setState({selectedDate: ''});
          alert('Please choose another day')
        }
        else if((clickMonth < currentMonth)){
          this.setState({selectedDate: ''});
          alert('Please choose another day')}
      }

        this.setState({
            selectedDate: day
          });
          //重複點兩次
          if(day === this.state.selectedDate){
            this.setState({
              selectedDate:""
            })
          }
         
    }
    nextWeek = () => {
        this.setState({
          currentMonth: addWeeks(this.state.currentMonth, 1),
        });
      };

    prevWeek = () => {
        this.setState({
          currentMonth: subWeeks(this.state.currentMonth, 1),
        });
      };

    handleSubmit = e =>{
      e.preventDefault();
      const selectedDate = this.state.selectedDate;
      const studentEmail = e.target.elements.studnetEmail.value;
      const studentNumber = e.target.elements.studentNumber.value;
      const studentContent = e.target.elements.content.value;
      const studentSubject = this.state.subject;

      var postData = JSON.stringify({'content':{
        Studnet_Email: studentEmail,
        Studnt_Number: studentNumber,
        Topic: studentSubject,
        Content:studentContent,
        Time:selectedDate,
        }});

        //post to node.js
        fetch('api/postEvents',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:postData,
          })
          .then(res => res.json())
          .then(function (data) {
            console.log('Request succeeded with JSON response', data);
            window.location.reload(false);

          })
          .catch(function (error) {
            console.log('Request failed', error);
          });
      
    }

    handleChange = (event) =>{
      this.setState({subject:event.target.value})
    }

    render(){
        return(
        <div className="calendar">
            {this.renderHeader()}
            {this.renderDays()}
        <div className="form">
          <h3 className='bookingInformation'>Booking Detail</h3>
          <Form onSubmit={this.handleSubmit} style={{'margin':'20px'}} className='formStyle'>
          <FormGroup>
            <Label for="exampleEmail">Student Email: </Label>
            <Input type="email" name="studnetEmail" id="exampleEmail" placeholder="Student Email..." />
            <span className='Alert' id = 'emailAlert'></span>
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Student Number: </Label>
            <Input type="text" name="studentNumber" id="examplePassword" placeholder="Student Number..." />
          </FormGroup>
          <FormGroup>
          <Label className='selectTag'>Subject: </Label>
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="IFN 701 Project">IFN 701 Project</option>
            <option value="IFN 680 AI">IFN 680 AI</option>
            <option value="IFN 647 Information Retrieveal">IFN 647 Information Retrieveal</option>
          </select>
          </FormGroup>
          
          <FormGroup>
            <Label for="exampleText">Description</Label>
            <Input type="textarea" name="content" id="exampleText" />
          </FormGroup>
          <FormGroup>
          <Button >Submit</Button>
          </FormGroup>
        </Form>
      </div>
        </div>)
    }
}

export default Calendar;