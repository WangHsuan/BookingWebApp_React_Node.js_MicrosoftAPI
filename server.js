const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv/config');
var bodyParser = require('body-parser')

//firebase--------------------------
var admin = require("firebase-admin");
var serviceAccount = require("./bookingweb-7c118-firebase-adminsdk-w97ed-89b70c4481.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bookingweb-7c118.firebaseio.com"
});
//test
var fireData = admin.database();
//read
fireData.ref('todos').once('value', function(snapshot){
    //console.log(snapshot.val());
})
//write
fireData.ref('todos').set({'title':'welcome to real world'})
.then(fireData.ref('todos').once('value', function(snapshot){
    console.log(snapshot.val());
}))
//-------------------------------------

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//postman to get calendar id
const CalendarID = process.env.CalendarID;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;

//get eveny day
const currentDay = new Date();
const currentDate = currentDay.getDate();
// const startDate = `2019-${currentDay.getMonth()+1}-${currentDate<10?'0'+currentDate:currentDate}T01:00:00`;
const startDate='2020-01-20T01:00:00'
const endDate = '2020-12-20T01:00:00';

//Get Calendar Data From Microsoft and then allows React to fetch
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

//Get data from React and then post to Microsoft Outlook
app.post('/api/postEvents',(req,res)=>{
    
    const content = req.body.content;
    //---------------------------------------
    if(content.Time.slice(9,11)==='30'){
        console.log(content.Time.slice(6,8))
        var addHour = Number(content.Time.slice(6,8))+1
        var timeToggle = '00'
        }
        else{
        var addHour = Number(content.Time.slice(6,8))
        timeToggle = '30'
        }
    
    var postData = {
        "Subject": `${content.Topic}`,
        "Body": {
        "ContentType": "HTML",
        "Content": `${content.Content}`
        },
        "Start": {
            "DateTime": `2019-${content.Time.slice(0,5)}T${content.Time.slice(6,11)}:00`,
            "TimeZone": "E. Australia Standard Time"
        },
        "End": {
            "DateTime":`2019-${content.Time.slice(0,5)}T${addHour}:${timeToggle}:00`,
            "TimeZone": "E. Australia Standard Time"
        },
        "Attendees": [
        {
            "EmailAddress": {
            "Address": `${content.Studnet_Email}`,
            "Name": "Janet Schorr"
            },
            "Type": "Required"
        }
        ]
        }  
    console.log(postData);
    //----------------------------------
//     fetch("https://login.microsoftonline.com/WangHsuan.onmicrosoft.com/oauth2/token", { method: 'POST',headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
//     body: `client_id=${clientID}&client_secret= ${clientSecret}&grant_type=client_credentials & resource=https://graph.microsoft.com`  })
//     .then(response => response.json())
//     .then(data =>{ 
    
// // console.log(postData);
// //PostEvent--------------------------
//   fetch(` https://graph.microsoft.com/beta/users/WangHsuan@WangHsuan.onmicrosoft.com/calendars/AQMkADMyZDg4AGU2OC05ZDUyLTQ1NzktYTIzNS1mOTYzMGNkOTFkMTkARgAAA-ZKmLIVon9Hm8YUE3_34WEHAOTndrKUfs5EvqsgdiNCkCYAAAIBBgAAAOTndrKUfs5EvqsgdiNCkCYAAAIdEQAAAA==/events` ,{
//        method:'POST',
//        body:JSON.stringify(postData),
//        headers: {
//          'Authorization': `bearer ${data.access_token}`,
//          'Content-Type':'application/json',
//      }
//     })
//       .then(function(response) {

//             return response.json();
//             })
//       .then(function(myJson) {
//         console.log(myJson)
//         res.json(myJson)
//       })

//    } ) // expecting a json response

})
   


const port = 5000;

app.listen(port,()=> console.log(`Server started on port ${port}`));