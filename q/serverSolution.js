const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config");
const transform = require("./transform");
const dispatch = require("./dispatch");

var app = express();
var svc;

//middleware
app.use(bodyParser.json());

//configure server
app.listen(config.ServerPort, () => {
  svc = getMessageService();
  console.log("Server running on port " + config.ServerPort);
});

//handle root route
app.get("/", (req,res) =>{
  res.send("Please make an 'enqueue' or 'next' request.");
});

//route for 'enqueue' request
app.post("/enqueue", (req,res) => {
  svc.enqueue(req.body);
  res.send("Message has been enqueued");
});

//route for 'next' request
app.post("/next", (req,res) => {
  const rawReturn = svc.next(req.body.queue);
  try{
    const returned = JSON.parse(rawReturn);
    res.json(returned);
  }
  catch(error){
    res.send("There was an error parsing the returned JSON: " + error);
  }
});

var inputQueue,queue0,queue1,queue2,queue3,queue4;
var sequenceMap;

//creates new instance of Message Service w/ callable functions 'enqueue' and 'next'
function getMessageService(){
  queue0 = []
  queue1 = []
  queue2 = []
  queue3 = []
  queue4 = []
  sequenceMap = new Map()
  console.log("(New message delivery service started.)");

  return {
    enqueue: enqueue,
    next: next
  }
}

//callable function -> enqueue's item by transforming & dispatching
function enqueue(message){
  transform.transformMessage(message, true, (error,transformedMessage) =>{
    if(error){
      console.log("ERROR: An error occurred while applying transformations: " + error)
    }
    else{
      dispatch.dispatchMessage(transformedMessage, sequenceMap, (error,dispatchedQueue,updatedMap) => {
        if(error){
          console.log("ERROR: An error occurred during dispatch: " + error)
        }
        else{
          sequenceMap = updatedMap
          switch (dispatchedQueue){
            case 0:
              queue0.unshift(transformedMessage.message)
              break;
            case 1:
              queue1.unshift(transformedMessage.message)
              break;
            case 2:
              queue2.unshift(transformedMessage.message)
              break;
            case 3:
              queue3.unshift(transformedMessage.message)
              break;
            case 4:
              queue4.unshift(transformedMessage.message)
              break;
            default:
              console.log("ERROR: Dispatch returned an invalid queue number.")
          }
        }
      })
    }
  });
}

//callable function -> returns appropriate next item in specified queue
function next(queueNum){
  switch (queueNum){
    case 0:
      return dequeue(queue0)
      break;
    case 1:
      return dequeue(queue1)
      break;
    case 2:
      return dequeue(queue2)
      break;
    case 3:
      return dequeue(queue3)
      break;
    case 4:
      return dequeue(queue4)
      break;
    default:
      console.log("ERROR: You have not entered a valid queue number.")
      return JSON.stringify({})
  }
}

//called internally by 'next' -> handles queue removal logic
function dequeue(queue){
  //immediately return error if queue empty
  if(queue.length < 1){
    console.log("ERROR: The specified queue is empty and cannot be dequeued.")
    return JSON.stringify({})
  }

  var nextMessage = queue[queue.length-1]

  //logic to handle case when next item is in sequence
  if(nextMessage.hasOwnProperty("_sequence")){
    var partList = sequenceMap.get(nextMessage["_sequence"]).partList
    //case when next item in queue is appropriate message in sequence to remove
    if(nextMessage.hasOwnProperty("_part") && nextMessage["_part"] == partList[0]){
      var currentVal = sequenceMap.get(nextMessage["_sequence"])
      currentVal.partList.shift()
      if(currentVal.partList.length == 0){
        sequenceMap.delete(nextMessage["_sequence"])
      }
      else{
        sequenceMap.set(nextMessage["_sequence"],currentVal)
      }
      return JSON.stringify(queue.pop())
    }
    //case when not the appropriate sequence message to remove (lower part # exists in queue)
    else{
      for(var i=queue.length-1;i>=0;i--){
        var currentMessage = queue[i]
        if(currentMessage.hasOwnProperty("_part") && currentMessage["_part"] == partList[0]){
          var currentVal = sequenceMap.get(currentMessage["_sequence"])
          currentVal.partList.shift()
          if(currentVal.partList.length == 0){
            sequenceMap.delete(currentMessage["_sequence"])
          }
          else{
            sequenceMap.set(currentMessage["_sequence"],currentVal)
          }
          var removedMessage = queue.splice(i,1)
          return JSON.stringify(removedMessage[0])
        }
      }
    }
  }

  return JSON.stringify(queue.pop())
}
