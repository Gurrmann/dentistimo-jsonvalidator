const { request } = require('http')
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.hivemq.com')
// Matches the time attribute from a booking request
// E.g. "YYYY-(MM or M)-(DD or D) (HH or H):MM" but with numbers "1234-12-01 14:30"
// ^ and $ to check that the entire string matches, only contains what we expect
const timeRegex = /^\d\d\d\d-\d\d-\d\d\s(\d\d|\d):\d\d$/

process.on('exit', exitHandler.bind(null));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

function exitHandler(options, exitCode) {
  if (options.exit){ 
    client.unsubscribe('bookingRequest')
    console.log("client unsubscribed")
    client.end()
    console.log("client ended")

    process.exit()
  }
}

let requestArray = []

client.on('connect', function () {
    client.subscribe('bookingRequest')
})

//IsJsonString(message)

function IsJsonString(str) {
  try {
    // Try to convert a string into a json object
    var json = JSON.parse(str)
    // Check if str is null or not a object (null, true, false or any number e.g. 123)
    if(json && typeof json === "object"){
      // Check that all attributes exsist and are of the correct type
      if(typeof json.userid === "number" && 
      typeof json.requestid === "number" && 
      typeof json.dentistid === "number" && 
      typeof json.issuance === "number" && 
      typeof json.time === "string"
      ) {
        // Check that time matches timeRegex
        if(timeRegex.test(json.time)){
          // Creates a new json object with the valid attributes, discards any extra attributes
          var validReq = ''
          if( typeof json.numberOfDentists === "number"){
            validReq = {
              "userid": json.userid,
              "requestid": json.requestid,
              "dentistid": json.dentistid,
              "issuance": json.issuance,
              "time": json.time,
              "numberOfDentists": json.numberOfDentists
            }            
          }
          else {
            validReq = {
              "userid": json.userid,
              "requestid": json.requestid,
              "dentistid": json.dentistid,
              "issuance": json.issuance,
              "time": json.time
            }
          }
          // Converts object to a string and publishes
          client.publish('validBookingRequest', JSON.stringify(validReq))
        }
      }
    }
  } catch (e) {}
}

let rateLimiter = () => {

  let interval = 50
  //decides how often the requests will be forwarded in miliseconds
  
  client.on('message', function (topic, message) {
    message = message.toString()
    requestArray.push(message)
    
  })
 
  setInterval(() => {

    
    if (requestArray.length > 0 ) {
    
      IsJsonString(requestArray.shift())
      
      }
    
      if (requestArray.length >= 500)  
      console.log('Currently expecting heavy load, Amount of requests in queue: ' + requestArray.length)
    
  }, interval);

}

rateLimiter()
