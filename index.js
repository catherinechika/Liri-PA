const fsp = require("fs").promises;

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
    const calendar = google.calendar({ version: "v3", auth });
    return new Promise(
        resolve,
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
                    events.map((event, i) => {
                        const start = event.start.dateTime || event.start.date;
                        var eventList = `${start} - ${event.summary}`;
                        // console.log(eventList)
                        resolve(eventList);
                    });
                } else {
                    console.log("No upcoming events found.");
                }
            }
        )
    );
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
    } catch {
        return console.log("Authorization failed");
    }

    listEvents(auth);
};