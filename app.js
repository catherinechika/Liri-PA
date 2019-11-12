const events = require("./index.js")
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const authorize = events.authorize
const listEvents = events.listEvents

console.log("here we are") 
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
    
});