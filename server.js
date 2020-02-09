const express = require('express');
const app = express();
const fetch = require('node-fetch');

app.get('/api/customers',(req,res)=>{
    const customers=[
        {id:1, firstName:"Hsuan",lastName:"Wang"},
        {id:2, firstName:"Jenny", lastName:"Hsieh"},
        {id:3, firstName:"Charles", lastName:"Hsieh"}
    ]

    res.json(customers);
})


//postman to get calendar id
const CalendarID = "AQMkADMyZDg4AGU2OC05ZDUyLTQ1NzktYTIzNS1mOTYzMGNkOTFkMTkARgAAA-ZKmLIVon9Hm8YUE3_34WEHAOTndrKUfs5EvqsgdiNCkCYAAAIBBgAAAOTndrKUfs5EvqsgdiNCkCYAAAIdEQAAAA==";
const clientID = "7d0a57c8-6f93-425d-9eb0-83a45a401277";
const clientSecret = "bXW4wqCkIX4*2N3rCD*NMpwrttBKxy-.";

//get eveny day
const currentDay = new Date();
const currentDate = currentDay.getDate();
// const startDate = `2019-${currentDay.getMonth()+1}-${currentDate<10?'0'+currentDate:currentDate}T01:00:00`;
const startDate='2020-01-20T01:00:00'
const endDate = '2020-12-20T01:00:00';


app.get('/api/getEvents',(req,res)=>{

    //fetch microsoft calendar events
    //outer fetch to get access token
    fetch(`https://login.microsoftonline.com/WangHsuan.onmicrosoft.com/oauth2/token`,{
        method:`POST`,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}, 
        body: 
        `client_id=${clientID}&client_secret= ${clientSecret}&grant_type=client_credentials & resource=https://graph.microsoft.com` 
    })
    .then(res => res.json())
    .then(data=>{
        
        //inner fetch to get calendar events
        fetch(`https://graph.microsoft.com/beta/users/WangHsuan@WangHsuan.onmicrosoft.com/calendars/${CalendarID}/calendarview?startDateTime=${startDate}&endDateTime=${endDate}&$top=1000` ,{
           method:'GET',
           headers: {
            Prefer: `outlook.timezone="E. Australia Standard Time"`,
             'Authorization': `bearer ${data.access_token}`,
         }
        })
        .then(res => res.json())
        .then(myJson => {
            var content = []
            for(let i in myJson['value']){
                    var timeStart = JSON.stringify(myJson['value'][i]['start']['dateTime'].slice(0,16));
                    var timeEnd = JSON.stringify(myJson['value'][i]['end']['dateTime'].slice(0,16))
                    content.push({Subject: JSON.stringify(myJson['value'][i]['subject']),
                    Start: timeStart,
                    End: timeEnd,
                }
              )
            }
          
            res.json(content);
        })
    })

})

// app.post('/api/postEvents',(req,res)=>{
//     res.json(req);
   
// })

const port = 5000;

app.listen(port,()=> console.log(`Server started on port ${port}`));