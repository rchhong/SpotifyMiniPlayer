// Liberal copy paste from Spotify API Guide
const express = require('express');
const app = express();
const port = process.env.PORT || 8888;

const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');

const spotifyAPIConsts = require(path.join(__dirname, "/consts"));

const client_id = spotifyAPIConsts.CLIENT_ID; // Your client id
const client_secret = spotifyAPIConsts.CLIENT_SECRET; // Your secret
const redirect_uri = spotifyAPIConsts.REDIRECT_URI; // Your redirect uri

const generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const STATEKEY = 'spotify_auth_state';

app.listen(port, () => {
    console.log(`listening on port ${ port }`);
});

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get("/helloworld", (req, res) => {
    res.send(JSON.stringify({"message" : "Hello World!"}));
});    

app.get('/login', (req, res) => {
    let state = generateRandomString(16);
    res.cookie(STATEKEY, state);

    const scope = 'user-read-playback-state'
    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type : 'code',
            client_id,
            scope,
            redirect_uri,
            state 
        }));
});

app.get('/callback', (req, res) => {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[STATEKEY] : null;

    if(state === null || state !== storedState) {
        res.redirect('http://localhost:3000/#' +
        querystring.stringify({
            error : 'state_mismatch'
        }));
    }
    else {
        res.clearCookie(STATEKEY);
        let authOptions = {
            url : 'https://accounts.spotify.com/api/token',
            form : {
                code,
                redirect_uri,
                grant_type : 'authorization_code'
            },
            headers : {
                'Authorization' : 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json : true
        };

        request.post(authOptions, (err, res, body) => {
            if(!err && res.statusCode == 200) {
                let access_token = body.access_token,
                    refresh_token = body.refresh_token;
                
                let options = {
                    url : 'https://api.spotify.com/v1/me',
                    headers : {'Authorization' : 'Bearer ' + access_token},
                    json : true
                };

                request.get(options, (err, res, body) => {
                    console.log(body);
                });

                res.redirect('http://localhost:3000/#' + 
                querystring.stringify({
                    access_token,
                    refresh_token
                }));
            }
            else {
                res.redirect('http://localhost:3000/#' + 
                    querystring.stringify({
                        error : "invalid_token"
                }));
            }
        });
    }
});

app.get('/refresh_token', (req, res) => {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
});



