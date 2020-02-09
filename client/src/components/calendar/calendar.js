import React from 'react';
import {format,addDays,startOfWeek,addWeeks,subWeeks, startOfDay,addMinutes,addMonths,subMonths,startOfMonth,endOfMonth,endOfWeek,isSameMonth,isSameDay,parse} from 'date-fns';
import "./calendar.css";


class Calendar extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
            fetchday:[],
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
            if(i == 0){
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
                <div className="col col-center title" key={i}>
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
      let stringClass = `calendar body cell `;
      if(day == this.state.selectedDate){
        stringClass += "selected";
      }

      const reg = /[a-zA-Z]/g;
      
      this.state.fetchday.map(date =>{
        console.log(date.Start.slice(6,date.Start.length-1).replace(reg," "))
        console.log("---------")
        console.log(day)
        if(day=== date.Start.slice(6,date.Start.length-1).replace(reg," ")){
          stringClass += ` selected`;
        }}
      )
        

      return stringClass;
    }
    

    onDateClick = day => {
        this.setState({
            selectedDate: day
          });
          //重複點兩次
          if(day == this.state.selectedDate){
            this.setState({
              selectedDate:""
            })
          }
          console.log(this.state.fetchday)
        
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

    render(){
        return(
        <div className="calendar">
            {this.renderHeader()}
            {this.renderDays()}
            
        </div>)
    }
}

export default Calendar;