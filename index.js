const fsp = require("fs").promises;
const { google } = require('googleapis');
// const fs = require('fs');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    let token;
    try {
        token = await fsp.readFile(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch {
        return getAccessToken(oAuth2Client);
    }
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(
        resolve,
        rlp.question("Enter the code from that page here: ", code => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error("Error retrieving access token", err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                    if (err) return console.error(err);
                    console.log("Token stored to", TOKEN_PATH);
                });
                resolve(oAuth2Client);
            });
        })
    );
}

const listEvents = auth => {
    const eventArray=[]
    const calendar = google.calendar({ version: "v3", auth });
    return new Promise(
        resolve =>
            calendar.events.list(
                {
                    calendarId: "primary",
                    timeMin: new Date().toISOString(),
                    maxResults: 10,
                    singleEvents: true,
                    orderBy: "startTime"
                },
                (err, res) => {
                    if (err) return console.log("The API returned an error: " + err);
                    const events = res.data.items;
                    if (events.length) {
                        console.log("Upcoming 10 events:");
                        resolve(
                            events.map(event => {
                                const start = event.start.dateTime || event.start.date;
                                let eventList = `${start} - ${event.summary}`;
                                eventArray.push(eventList)
                                console.log(eventList)
                                // return eventList
                            })
                        )
                    } else {
                        console.log("No upcoming events found.");
                    }
                }
            )
    );
    console.log(eventArray)
};
module.exports = async function () {
    let credentials;
    try {
        content = await fsp.readFile("credentials.json");
    } catch {
        return console.log("Could not read 'credentials.json'");
    }

    let auth;
    try {
        auth = await authorize(JSON.parse(content));
    } catch (err) {
        return console.log(err);
    }

    listEvents(auth);
};