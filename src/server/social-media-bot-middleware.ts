import { APP_NAME, APP_URL } from './constants';
import { DataIntermediary } from './data-intermediate';

/*
* When a social media crawler bot reaches the server we want it to be presented with
* static info, not the normal Angular frontend. This will mean that links to the app
* shared on social media will look nice and fancy and specific to that URL (e.g.
* having the team name in the description when linking to the tracking page for that
* team)
*/
export function socialMediaBotMiddleware(dataIntermediate: DataIntermediary) {
    return (req, res, next) => {
        let userAgent = req.get('User-Agent');

        let facebook = (ua) => ua.includes("Facebot") || ua.includes("facebookexternalhit");
        let twitter = (ua) => ua.includes("Twitterbot")

        let isFacebook = facebook(userAgent);
        let isTwitter = twitter(userAgent);
        
        if (!isFacebook && !isTwitter) {
            // If neither, then move on as normal!
            return next();
        }

        console.log('Received request from Facebook or Twitter social media bot!');

        /*
            * Now we know it's a bot, we can look at the request to see what data it wants and
            * then get it from the database, so that it can be included in the response
            */

        let originalURL = req.originalUrl;

        /*
            * There are two public pages specified:
            *
            * 1. '/' - Just the normal public map view
            *
            * 2. '/track/TEAM_NUMBER' - For tracking a specific team
            *
            */

        function createResponseHTML(data) {
            return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta property="og:title" content="${data.title}" />
                    <meta property="og:description" content="${data.description}" />
                    <meta property="og:image" content="${data.image}" />
                </head>
                <body>
                    <h1>You look like a bot</h1>
                    <p>You're seeing this page because your browser's User Agent is detected as being
                    the Facebook or Twitter crawler bot.</p>
                    <p>These bots have been presented with this information</p>
                    <table>
                    <tr>
                    <th>og:title</th>
                    <td>${data.title}</td>
                    </tr>
                    <tr>
                    <th>og:description</th>
                    <td>${data.description}</td>
                    </tr>
                    <tr>
                    <th>og:image</th>
                    <td>
                        <p>${data.image}</p>
                        <img src='${data.image}'>
                    </td>
                    </tr>
                    </table>
                </body>
            </html>
            `
        }

        const basicData = {
            title: APP_NAME,
            description: "Keep track of all the teams as they hitchhike for charity!",
            image: APP_URL + "assets/img/race2_prague.jpg"
        }

        let match
        console.log('original URL', originalURL)
        if (match = originalURL.match(/^\/track\/(\w*)$/)) {
            // Team tracker
            let teamId = match[1];
            dataIntermediate.getTeam(teamId)
            .then(team => team.stripPrivateData())
            .then(publicTeam => {
            let data = JSON.parse(JSON.stringify(basicData));
            data.title = `Track ${publicTeam.getPrettyRacersList()} as they hitchhike for charity!`;
            if (publicTeam.affiliation) {
                data.description = `${publicTeam.name} are affiliated to ${publicTeam.affiliation}`
            } else {
                data.description = `${publicTeam.name}`
            }
            let generatedHTML = createResponseHTML(data);
            res.send(generatedHTML);
            })
            .catch(err => {
            let generatedHTML = createResponseHTML(basicData);
            res.send(generatedHTML);
            })
        } else {
            // No need for special treatment, send the standard response
            let generatedHTML = createResponseHTML(basicData);
            res.send(generatedHTML);
        }
    };
}