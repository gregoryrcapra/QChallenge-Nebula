# QChallenge-Nebula

This is a simple queue-based message delivery service written using Node.js.

### Run Instructions

1) Make sure Node.js is installed on your machine
2) Clone this repo and run **npm install** from your terminal window
3) On the command line, navigate to where the project root is
4) Run **node basicTests.js**
5) Add more of your own tests to that file, similar to the paradigm specified

### Run Instructions- Server

1) Follow steps 1-3 above
2) Run **node serverSolution.js**, this will start the server running on port 3000
3) Open up another terminal window
4) Make 'enqueue' or 'next' requests from the new window in this manner:
- curl -d "{\"test\": \"Nebula\", \"int_value\": 0, \"_special\": \"someVal\"}" -H "Content-Type: application/json" -X POST http://localhost:3000/enqueue

- curl -d "{\"queue\": 0}" -H "Content-Type: application/json" -X POST http://localhost:3000/next

The "-d" flag specifies the JSON data, and the "-H" flag specifies the POST content as JSON.

*NOTE: when making CURL requests on Windows you can only enter double quotes and you must escape them with a backslash*

### Upcoming Changes

1) Switching testing framework to Mocha
2) Upgrade to ES6 using Babel
