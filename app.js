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

// Shell page - Render shell.ejs
app.get('/shell', (req, res) => {
    res.render('shell');
  });

// Cannot GET / error fix
app.get('/', (req, res) => {
    res.render('proxy');
  });

// Check if the user is authorized to access the shell
function checkAuthorization(req, res, next) {
    const password = req.query.password; // Assuming the password is passed as a query parameter
  
    // Replace 'your_password' with your desired password
    if (password === 'OMGNODEHASSHELL!!!1') {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
}

// Test route for server-side password check
app.get('/testpassword', (req, res) => {
    const password = req.query.password; // Assuming the password is passed as a query parameter
  
    // Replace 'your_password' with your desired password
    if (password === 'OMGNODEHASSHELL!!!1') {
      res.send('Password is correct.');
    } else {
      res.status(401).send('Unauthorized');
    }
  });

// Handle command execution
app.get('/execute', checkAuthorization, (req, res) => {
    const command = req.query.command; // Assuming the command is passed as a query parameter
  
    // Implement your logic to execute the command here
    // For this example, we'll just respond with a message
    const output = `Command executed: ${command}`;
    res.send(output);
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

const loggedIPs = [];

// Middleware to log IP addresses
app.use((req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`IP Address: ${clientIP}`);
  
    // Add the IP address to the loggedIPs array
    loggedIPs.push(clientIP);
  
    next();
  });
  
  // Handle "showips" command
  app.get('/showips', (req, res) => {
    // In this example, we will display all the logged IP addresses.
    // Note that this is for educational purposes only, and displaying real IP addresses without consent can have privacy implications.
  
    const ipList = loggedIPs.join('\n');
    const output = `Logged IP Addresses:\n${ipList}`;
    res.send(output);
  });

  // Help command - Define the commands and their descriptions
const commands = {
    help: 'Display a list of available commands and their descriptions.',
    print: 'Print the provided text to the shell output.',
    showips: 'Shows realtime ips of the clients that are currently on the proxy',
    math: 'Dont play dumb'
    // Add more commands here as needed
  };
  
  // Help command route
  app.get('/help', checkAuthorization, (req, res) => {
    let output = 'Available Commands:\n\n';
    for (const command in commands) {
      output += `${command} - ${commands[command]}\n`;
    }
    res.send(output);
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
