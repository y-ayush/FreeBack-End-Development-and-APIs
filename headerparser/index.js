// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.set("trust proxy", true);

app.get("/api/whoami", (req, res) => {
  // Retrieve the client's IP address. When behind a proxy,
  // req.ip returns the client's IP if trust proxy is enabled.
  const ipaddress =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "";

  // Retrieve the client's preferred language from the request headers.
  const language = req.headers["accept-language"];

  // Retrieve the client's software (user-agent) from the request headers.
  const software = req.headers["user-agent"];

  res.json({ ipaddress, language, software });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
