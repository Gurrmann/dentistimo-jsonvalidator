// Matches the time attribute from a booking request
// E.g. "YYYY-(MM or M)-(DD or D) (HH or H):MM" but with numbers "1234-12-1 14:30"
// ^ and $ to check that the entire string matches, only contains what we expect
const timeRegex = /^\d\d\d\d-(\d\d|\d)-(\d\d|\d)\s(\d\d|\d):\d\d$/

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
        typeof json.time === "string") {
        // Check that time matches timeRegex
        if(timeRegex.test(json.time)){
          return true
        }
      }
    }
  } catch (e) {}
  return false
}
