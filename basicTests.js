const solution = require("./q/solution.js");

function getNewService() {
  return solution.getMessageService()
}

//handler for transformation type tests
function transformationTests(){
  console.log("----------Starting Transformation Tests----------")
  testIntegerNegation()
  testNebulaReverse()
  testHashField()
  testIgnorePrivateFields()
  console.log("\n")
}

//handler for dispatching type tests
function dispatchingTests(){
  console.log("----------Starting Dispatching Tests----------")
  testQueue0()
  testQueue1()
  testQueue2()
  testQueue3()
  testQueue4()
  console.log("\n")
}

//handler for sequencing type tests
function sequencingTests(){
  console.log("----------Starting Sequencing Tests----------")
  testSequenceReturnOrder()
  testSequenceDispatching()
  console.log("\n")
}

//handler for edge case type tests (empty input, faulty JSON, etc.)
function edgeCaseTests(){
  console.log("----------Starting Edge Case Tests----------")
  testEmptyInput()
  badDequeuing()
  console.log("\n")
}

/*
--------------------------------------------------------------------
Individualized Tests called by above handlers
--------------------------------------------------------------------
*/
function testIntegerNegation() {
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "message", "int_value": 512}')
  const returned = JSON.parse(svc.next(3))
  if (returned["int_value"] !== -513){
    passedAll = false
    console.log("**FAILED** You did not negate the integer value.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all integer negation tests!")
}

function testNebulaReverse(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebula, Inc.", "int_value": -212}')
  const returned = JSON.parse(svc.next(2))
  if (returned["test"] !== '.cnI ,alubeN'){
    passedAll = false
    console.log("**FAILED** You did not reverse the string 'Nebula'.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all Nebula reverse tests!")
}

function testHashField(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "message", "int_value": 0, "secret": "the secret", "_hash": "secret"}')
  const returned = JSON.parse(svc.next(1))
  if (!returned.hasOwnProperty("hash")){
    passedAll = false
    console.log("**FAILED** You did not add a hash field.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all hash field tests!")
}

function testIgnorePrivateFields(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "message", "int_value": 77, "secret": "the secret", "_hash": "secret", "_ignore1": "ignoreThisVal", "_ignore2": 27}')
  const returned = JSON.parse(svc.next(1))
  if (returned["_ignore1"] !== "ignoreThisVal" || returned["_ignore2"] !== 27){
    passedAll = false
    console.log("**FAILED** You did not ignore the secret fields.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all private field tests!")
}

function testEmptyInput(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue("{}")
  const returned = JSON.parse(svc.next(4))
  if (JSON.stringify(returned) !== "{}"){
    passedAll = false
    console.log("**FAILED** Empty JSON was not handled properly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all empty input tests!")
}

function testSequenceReturnOrder(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "message", "int_value": 77, "_sequence": "thesequence", "_part": 0}')
  svc.enqueue('{"test": "Nebula", "int_value": 77, "_sequence": "thesequence", "_part": 37}')
  svc.enqueue('{"test": "Nebula", "int_value": 77, "_sequence": "thesequence", "_part": 22}')
  svc.enqueue('{"test": "Nebula", "int_value": 77, "_sequence": "thesequence", "_part": 1}')
  const returned = JSON.parse(svc.next(3))
  if (returned["_part"] !== 0){
    passedAll = false
    console.log("**FAILED** You did not handle part 0 of the sequence correctly.");
  }
  const returned2 = JSON.parse(svc.next(3))
  if (returned2["_part"] !== 1){
    passedAll = false
    console.log("**FAILED** You did not handle part 1 of the sequence correctly.");
  }
  const returned3 = JSON.parse(svc.next(3))
  if (returned3["_part"] !== 22){
    passedAll = false
    console.log("**FAILED** You did not handle part 22 of the sequence correctly.");
  }
  const returned4 = JSON.parse(svc.next(3))
  if (returned4["_part"] !== 37){
    passedAll = false
    console.log("**FAILED** You did not handle part 37 of the sequence correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all sequence return order tests!")
}

function testQueue0(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebula", "int_value": 0, "_special": "someVal"}')
  const returned = JSON.parse(svc.next(0))
  if(JSON.stringify(returned) == "{}"){
    passedAll = false
    console.log("**FAILED** You did not handle dispatching to queue 0 correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all dispatching to queue 0 tests!")
}

function testQueue1(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebula", "int_value": 0, "hash": "someHashVal"}')
  const returned = JSON.parse(svc.next(1))
  if(JSON.stringify(returned) == "{}"){
    passedAll = false
    console.log("**FAILED** You did not handle dispatching to queue 1 correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all dispatching to queue 1 tests!")
}

function testQueue2(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebula", "int_value": 220, "zzhashzz": "zzsomeHashValzz"}')
  const returned = JSON.parse(svc.next(2))
  if(JSON.stringify(returned) == "{}"){
    passedAll = false
    console.log("**FAILED** You did not handle dispatching to queue 2 correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all dispatching to queue 2 tests!")
}

function testQueue3(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebzzula", "int_value": 220, "zzhashzz": "zzsomeHashValzz"}')
  const returned = JSON.parse(svc.next(3))
  if(JSON.stringify(returned) == "{}"){
    passedAll = false
    console.log("**FAILED** You did not handle dispatching to queue 3 correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all dispatching to queue 3 tests!")
}

function testQueue4(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebzzula", "int_value": "220", "zzhashzz": "zzsomeHashValzz", "someOtherField": "someOtherVal"}')
  const returned = JSON.parse(svc.next(4))
  if(JSON.stringify(returned) == "{}"){
    passedAll = false
    console.log("**FAILED** You did not handle dispatching to queue 4 correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all dispatching to queue 4 tests!")
}

function testSequenceDispatching(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebula", "_special": "specialVal", "int_value": 77, "_sequence": "thesequence", "_part": 0}')
  svc.enqueue('{"test": "Nebzzula", "_sequence": "thesequence", "_part": 3}')
  svc.enqueue('{"test": "Nebzzula","hash": "hashVal", "_sequence": "thesequence", "_part": 4}')
  svc.enqueue('{"test": "Nebzzula", "int_value": 8222, "_sequence": "thesequence", "_part": 2}')
  const returned = JSON.parse(svc.next(0))
  if (JSON.stringify(returned) == "{}" || returned["_part"] !== 0){
    passedAll = false
    console.log("**FAILED** You did not handle sequence dispatching correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all sequence dispatching tests!")
}

function badDequeuing(){
  var passedAll = true
  const svc = getNewService()
  svc.enqueue('{"test": "Nebula", "_special": "specialVal", "int_value": 77, "_sequence": "thesequence", "_part": 0}')
  const returned = JSON.parse(svc.next(4))
  if (JSON.stringify(returned) !== "{}"){
    passedAll = false
    console.log("**FAILED** Wrong queue test was not handled properly.");
  }
  svc.next(0)
  const returned2 = JSON.parse(svc.next(0))
  if (JSON.stringify(returned2) !== "{}"){
    passedAll = false
    console.log("**FAILED** Empty queue test was not handled properly.");
  }
  svc.enqueue('{"test": "Nebzzula", "int_value": "220", "zzhashzz": "zzsomeHashValzz", "someOtherField": "someOtherVal"}')
  const returned3 = JSON.parse(svc.next(5))
  if(JSON.stringify(returned3) !== "{}"){
    passedAll = false
    console.log("**FAILED** Queue out of range test was not handled correctly.");
  }

  if(passedAll)
    console.log("**SUCCESS** Passed all wrong queue tests! (there should be three above errors)")
}

//run four different kinds of tests
transformationTests()
dispatchingTests()
sequencingTests()
edgeCaseTests()
