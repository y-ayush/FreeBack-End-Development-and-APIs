require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


app.use(express.urlencoded({ extended: false }));

// In-memory database to store URLs
const urlDatabase = {};
let urlCount = 1;

// POST endpoint to create a shortened URL
app.post("/api/shorturl", (req, res) => {
  const original_url = req.body.url;

  // Validate the URL using the URL constructor.
  try {
    const parsedUrl = new URL(original_url);

    // Use DNS lookup to verify that the hostname exists
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        // If DNS lookup fails, the URL is invalid
        return res.json({ error: "invalid url" });
      } else {
        // Check if the URL is already in our database to avoid duplicates
        for (const key in urlDatabase) {
          if (urlDatabase[key] === original_url) {
            return res.json({
              original_url,
              short_url: Number(key)
            });
          }
        }
        // If new, assign a short URL id and store it
        const short_url = urlCount;
        urlDatabase[short_url] = original_url;
        urlCount++;
        return res.json({
          original_url,
          short_url
        });
      }
    });
  } catch (e) {
    // If the URL constructor throws, it's not a valid URL.
    return res.json({ error: "invalid url" });
  }
});

// GET endpoint to redirect to the original URL
app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = req.params.short_url;
  const original_url = urlDatabase[short_url];
  if (original_url) {
    return res.redirect(original_url);
  } else {
    return res.json({ error: "No short URL found for the given input" });
  }
});
