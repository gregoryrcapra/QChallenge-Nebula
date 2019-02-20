const utf8 = require("utf8");
const crypto = require("crypto");
const config = require("./config");

//wrapper function with error handling & callback
var transformMessage = (message,callback) => {
  try{
    var parsedMessage = JSON.parse(message);
  }
  catch(error){
    console.log("ERROR: An error occurred while parsing the JSON: " + error);
  }
  var modifiedMessageObject = applyTransformations(parsedMessage);
  callback(undefined, modifiedMessageObject);
}

//function to apply transformations in order -> returns modified message
function applyTransformations(message){
  var messageObject = {
    message: message,
    containsHash: false,
    hasNebula: false,
    hasInt: false
  };
  for (var key in message) {
    if (message.hasOwnProperty(key)) {
        //ignore private fields
        if(key.charAt(0) == "_" && key !== "_hash"){
          continue
        }
        //Nebula check-> string reverse
        if (typeof(message[key]) == "string" && message[key].indexOf("Nebula") !== -1){
          var prevValue = message[key]
          message[key] = prevValue.split("").reverse().join("")
          messageObject.hasNebula = true
        }
        //Integer check-> bitwise negation
        if (typeof(message[key]) == "number"){
          var prevValue = message[key]
          message[key] = ~prevValue
          messageObject.hasInt = true
        }
        //_hash check -> added field
        if(key == "_hash"){
          messageObject.containsHash = true
          var otherField = message[key]
          if(message.hasOwnProperty(otherField)){
            var otherVal = message[otherField]
            var hashVal = crypto.createHmac("sha256",config.SigningSecret).update(utf8.encode(otherVal))
              .digest()
              .toString("base64");
            message["hash"] = hashVal
          }
        }
    }
  }
  messageObject.message = message
  return messageObject
}

module.exports.transformMessage = transformMessage;
