var exampleBookingReq = {
  "userid": 12345,
  "requestid": 13,
  "dentistid": 1,
  "issuance": 1602406766314,
  "time": "2020-12-14 14:30"
  }
exampleBookingReq = JSON.stringify(exampleBookingReq)
console.log(IsJsonString(exampleBookingReq))
console.log(exampleBookingReq)

function IsJsonString(str) {
  try {
    // Try to convert a string into a json object
    var str = JSON.parse(str)
    // Check if str is null or not a object (null, true, false or any number i.e. 123)
    if(str && typeof str === "object"){
      return true
    }
  } catch (e) {}
  return false
}
