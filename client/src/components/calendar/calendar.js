import React from 'react';
import {format,addDays,startOfWeek,addWeeks,subWeeks,addMinutes,isPast,parseISO, isWithinInterval} from 'date-fns';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';


class Calendar extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
            fetchday:[],
            subject:'IFN 701 Project',
            addMinutesDate:new Date(2020, 1, 10, 9, 0),
            supervisorTime: {}
        };
    }
    componentDidMount(){
      fetch('api/getEvents')
      .then(res => res.json())
      .then(fetchday => 
        this.setState({fetchday}))

      fetch('api/Time')
      .then(res => res.json())
      .then(data => this.setState({supervisorTime:data}))
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
                
                {this.renderCells(format(addDays(startDate, i), "MM-dd kk:mm"))}
               
                </div>                
              );
            }
          }
            
        return <div className="days row">{days}</div>;
    }
    renderCells(current_day) {      
      const timeFormat = 'MM-dd kk:mm eee';
      let minutes = 0;
      let time=[];      
      for(let i=0;i<17;i++){
        //---------------------------------------------------------------------------------------------------------------------------
        let currentTime = format(addMinutes(new Date(2020,current_day.slice(1,2)-1,current_day.slice(3,5),9,0), minutes), timeFormat);
        //從早上九點開始
        time.push(<div  className={this.renderClass(currentTime)}
        key={currentTime} id={currentTime} onClick={() => {this.onDateClick(currentTime); }}>             
              {currentTime.slice(6,11)}                     
       </div>);
      //Time Slot
      minutes+=30;     
      }
      
      return time
      }

    renderClass = day =>{
      //for isPast
      let dateFormate = `2020-${day.slice(0,2)}-${day.slice(3,5)}T${day.slice(6,8)}:${day.slice(9,11)}`;
      let stringClass = `calendar body cell `;
      if(day === this.state.selectedDate){
        stringClass += "selected";
      }

      const reg = /[a-zA-Z]/g;
      //let fetchday becomes red
      this.state.fetchday.map(date =>{  
        if(day.slice(0,11) == date.Start.slice(6,date.Start.length-1).replace(reg," ")){
          stringClass += ` selected`;
        }       
      }      
      )

      //PastTime
      if(isPast(parseISO(dateFormate))){
        stringClass = `calendar body cell unavailable`;
      }

      //supervisor Time
      
      const weekList = ['Mon','Tue','Wed','Thu','Fri'];
      const weekListValue = {'Mon':0,'Tue':1,'Wed':2,'Thu':3,'Fri':4};

      weekList.map(weekday => {
      
          if(day.slice(-3) === weekday){
            //console.log(day.slice(-3))
            
            if(typeof this.state.supervisorTime['Start'] !== 'undefined'){
              const number = weekListValue[weekday]
              const startTime = this.state.supervisorTime['Start'][number];
              const endTime = this.state.supervisorTime['End'][number];
              //-------------------------------------------------------
              //console.log(startTime)
              const startFormat = new Date(2020, 2,10 ,startTime,0);
              const endTimeFormat = new Date(2020, 2,10,endTime,0);
              const currentFormat = new Date(2020, 2, 10 ,day.slice(6,8),0);
              //console.log(isWithinInterval(currentFormat, { start: startFormat, end: endTimeFormat}));
              if(!isWithinInterval(currentFormat, { start: startFormat, end: endTimeFormat})){
                stringClass = `calendar body cell unavailable`
              }
            }
          
          }

     });
      

      return stringClass;
    }
    

    onDateClick = day => {
     
      console.log(day)
      console.log(day.slice(0,2))
      // console.log(this.state.supervisorTime[`friday`])
      // console.log(day.slice(6,8));
     //if timeSlot is red, it will alert plz choose another day
     
      const className = document.getElementById(day).className;
      
      if(className === "calendar body cell  selected" || className === `calendar body cell unavailable`){
        alert('Please choose another day');
        this.setState({selectedDate: ''});
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