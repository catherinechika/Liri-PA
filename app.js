const events = require("./index.js")
const listEvent = events()

const promise = listEvent

const list = () => console.log("from yonder: " + list)
const error = () => console.log("error")

promise.then(list, error)

