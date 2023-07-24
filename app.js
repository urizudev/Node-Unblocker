// app.js

const express = require('express');
const Unblocker = require('unblocker');
const app = express();
const path = require('path');

// Set 'ejs' as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Our User-Agent Middleware
function setUserAgent(data) {
  data.headers['user-agent'] =
    'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
}

// Middleware to log IP addresses
app.use((req, res, next) => {
    console.log(`IP Address: ${req.ip}`);
    next();
  });

// Create Unblocker Instance
const unblocker = new Unblocker({
  prefix: '/proxy/',
  requestMiddleware: [setUserAgent],
});

// Configure Our Express Server to Use It
app.use(unblocker);

// Homepage - Render proxy.ejs
app.get('/proxy', (req, res) => {
  res.render('proxy');
});

// Handle Links and Search Queries
app.get('/search', (req, res) => {
  const query = req.query.query;
  if (query) {
    if (query.startsWith('www')) {
      res.redirect(`/proxy/${query}`);
    } else {
      res.redirect(`/proxy/https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
  } else {
    res.redirect('/proxy');
  }
});

// Command to unhide and list IP addresses
app.get('/unhide', (req, res) => {
    if (req.query.key === 'your_secret_key') {
      // Replace 'your_secret_key' with a secret key that you keep private
      // This is an additional security measure to ensure only authorized users can access this command.
  
      // Here, you can list the IP addresses or perform any other action you want.
      // For this example, we'll just respond with a message.
      res.send('IP addresses listed.');
    } else {
      res.status(403).send('Unauthorized');
    }
  });

// Launches Server on Port 8080
const port = process.env.PORT || 8080;
app.listen(port).on('upgrade', unblocker.onUpgrade);
console.log('░█▀█░█▀█░█▀▄░█▀▀')
console.log('░█░█░█░█░█░█░█▀▀')
console.log('░▀░▀░▀▀▀░▀▀░░▀▀▀')
console.log('Node Unblocker Server Running On Port:', port);
