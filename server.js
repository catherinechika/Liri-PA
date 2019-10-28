const express = require("express")
const events = require("./index")
// import * as events from "client/index.js"
const app = express()
PORT = 3000


app.get("/", function (request, response) {
    console.log("Serving" + events)
    response.json(events)
})


app.listen(PORT, function () {
    console.log("Listening on http://localhost:" + PORT)
})