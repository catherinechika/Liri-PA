const express= require ("express")
const app = express()
PORT = 3000


app.get("/hello", function (request, response){
    response.send("Hello!")
})


app.listen(PORT, function(){
    console.log("Listening on http://localhost:"+ PORT)
})