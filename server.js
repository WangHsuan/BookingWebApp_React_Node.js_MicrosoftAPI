const express = require('express');
const app = express();
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;
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
    //console.log(snapshot.val());
}))

//Seed

// fireData.ref('businessTime').set({'monday':{Start:`09:00`,End:`17:00`},'tuesday':{Start:`09:00`,End:`17:00`},'wednesday':{Start:`09:00`,End:`17:00`},'thursday':{Start:`09:00`,End:`17:00`},'friday':{Start:`09:00`,End:`17:00`}})
// .then( 
//     fireData.ref('businessTime').once('value',function(snapshot){
//       //console.log(snapshot.val());
//     })
//   )
//update

//-------------------------------------

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//postman to get calendar id
const CalendarID = process.env.CalendarID;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const OutlookAccount = process.env.OutlookAccount;
const OutlookAccountShort = process.env.OutlookAccountShort;

//get eveny day
const currentDay = new Date();
const currentDate = currentDay.getDate();
// const startDate = `2019-${currentDay.getMonth()+1}-${currentDate<10?'0'+currentDate:currentDate}T01:00:00`;
const startDate='2020-01-20T01:00:00'
const endDate = '2020-12-20T01:00:00';

//Get Calendar Data From Microsoft and then allows React to fetch
app.get('/api/getEvents',(req,res)=>{
    console.log(process.env.OutlookAccountShort)
    //fetch microsoft calendar events
    //outer fetch to get access token
    fetch(`https://login.microsoftonline.com/${OutlookAccountShort}/oauth2/token`,{
        method:`POST`,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}, 
        body: 
        `client_id=${clientID}&client_secret= ${clientSecret}&grant_type=client_credentials & resource=https://graph.microsoft.com` 
    })
    .then(res => res.json())
    .then(data=>{
        
        //inner fetch to get calendar events
        fetch(`https://graph.microsoft.com/beta/users/${OutlookAccount}/calendars/${CalendarID}/calendarview?startDateTime=${startDate}&endDateTime=${endDate}&$top=1000` ,{
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
    //----------------------------------
    fetch(`https://login.microsoftonline.com/${OutlookAccountShort}/oauth2/token`, { 
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
        body: `client_id=${clientID}&client_secret= ${clientSecret}&grant_type=client_credentials & resource=https://graph.microsoft.com`  })
        .then(response => response.json())
        .then(data =>{ 
       
    //data------------------------------
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
            "DateTime": `2020-${content.Time.slice(0,5)}T${content.Time.slice(6,11)}:00`,
            "TimeZone": "E. Australia Standard Time"
        },
        "End": {
            "DateTime":`2020-${content.Time.slice(0,5)}T${addHour}:${timeToggle}:00`,
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
        
        //PostEvent--------------------------
        fetch(`https://graph.microsoft.com/beta/users/${OutlookAccount}/calendars/${CalendarID}/events` ,{
            method:'POST',
            body:JSON.stringify(postData),
            headers: {
                'Authorization': `bearer ${data.access_token}`,
                'Content-Type':'application/json',
            }
            })
            .then(function(response) {
                    return response.json();
                    })
            .then(function(myJson) {
                res.json(myJson)
            })

   } ) // expecting a json response

})

//Get Business Time From Supervisor-----------------
app.post('/api/getBusinessTime',(req,res)=>{
    let business_time = req.body.business_time;
    console.log(business_time )
    var businessTimeFormate ={'Mon':{Start:business_time['Start'][0],End:business_time['End'][0]},'Tue':{Start:business_time['Start'][1],End:business_time['End'][1]},'Wed':{Start:business_time['Start'][2],End:business_time['End'][2]},'Thr':{Start:business_time['Start'][3],End:business_time['End'][3]},'Fri':{Start:business_time['Start'][4],End:business_time['End'][4]}};
    
    fireData.ref('businessTime').set(business_time)
    .then( 
        fireData.ref('businessTime').once('value',function(snapshot){
        //console.log(snapshot.val());
    })
    )
    res.json(businessTimeFormate)
  })

app.get('/api/Time',(req,res)=>{

    fireData.ref('businessTime').once('value', function(snapshot){
        console.log(typeof(snapshot.val()));
        res.json(snapshot.val());
    })

    })

const port = 5000;

app.listen(port,()=> console.log(`Server started on port ${port}`));