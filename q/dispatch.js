
//dispatch logic in order -> returns (errorMessage, targetQueue, sequenceMap)
var dispatchMessage = (messageObject,sequenceMap,callback) => {
  var firstPartOfSequence = false;
  if(messageObject.hasOwnProperty("message")){
    //dispatch handling for sequences
    if(messageObject["message"].hasOwnProperty("_sequence") && typeof(messageObject["message"]["_sequence"]) == "string"){
      if(messageObject["message"].hasOwnProperty("_part") && typeof(messageObject["message"]["_part"]) == "number"){
        //first message in sequence
        if(messageObject["message"]["_part"] == 0){
          sequenceMap.set(messageObject["message"]["_sequence"],{queue: undefined, partList: [0]});
          firstPartOfSequence = true;
        }
        //later message in sequence -> follow first
        else if(messageObject["message"]["_part"] > 0){
          var currentVal = sequenceMap.get(messageObject["message"]["_sequence"]);
          currentVal.partList.push(messageObject["message"]["_part"]);
          currentVal.partList.sort();
          sequenceMap.set(messageObject["message"]["_sequence"],currentVal);
          callback(undefined,currentVal.queue,sequenceMap);
          return
        }
        else{
          callback("'_part' field has unexpected value.",undefined,sequenceMap);
          return
        }
      }
      else{
        callback("Either message has no '_part', or '_part' is not a number.",undefined,sequenceMap);
        return
      }
    }
    //'_special' field check
    if(messageObject["message"].hasOwnProperty("_special")){
      if(firstPartOfSequence){
        var currentVal = sequenceMap.get(messageObject["message"]["_sequence"]);
        currentVal.queue = 0
        sequenceMap.set(messageObject["message"]["_sequence"],currentVal);
      }
      callback(undefined,0,sequenceMap);
    }
    //'hash' field check
    else if (messageObject.message.hasOwnProperty('hash') || (messageObject.hasOwnProperty("containsHash") && messageObject["containsHash"] == true)) {
      if(firstPartOfSequence){
        var currentVal = sequenceMap.get(messageObject["message"]["_sequence"]);
        currentVal.queue = 1
        sequenceMap.set(messageObject["message"]["_sequence"],currentVal);
      }
      callback(undefined,1,sequenceMap);
    }
    //Nebula reverse check
    else if (messageObject.hasOwnProperty("hasNebula") && messageObject["hasNebula"] == true) {
      if(firstPartOfSequence){
        var currentVal = sequenceMap.get(messageObject["message"]["_sequence"]);
        currentVal.queue = 2
        sequenceMap.set(messageObject["message"]["_sequence"],currentVal);
      }
      callback(undefined,2,sequenceMap);
    }
    //Integer negation check
    else if (messageObject.hasOwnProperty("hasInt") && messageObject["hasInt"] == true) {
      if(firstPartOfSequence){
        var currentVal = sequenceMap.get(messageObject["message"]["_sequence"]);
        currentVal.queue = 3
        sequenceMap.set(messageObject["message"]["_sequence"],currentVal);
      }
      callback(undefined,3,sequenceMap);
    }
    //All others not covered by above
    else{
      if(firstPartOfSequence){
        var currentVal = sequenceMap.get(messageObject["message"]["_sequence"]);
        currentVal.queue = 4
        sequenceMap.set(messageObject["message"]["_sequence"],currentVal);
      }
      callback(undefined,4,sequenceMap);
    }
  }
  else{
    callback("Message object sent to dispatch does not have 'message' field.",undefined,sequenceMap);
  }
}

module.exports.dispatchMessage = dispatchMessage;
