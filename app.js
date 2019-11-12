const events = require("./index.js")
const listEvent = events()

listEvent.then(eventList=> console.log (eventList))