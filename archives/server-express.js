const express = require('express');
const app = express();

// Require your game modules
const game1 = require('./Testing/game1');
const game2 = require('./Testing/game2');
// ...

// Serve the index.html as the main entry point
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Testing/nav.html');
});
// Serve static assets such as images, stylesheets, and scripts
// app.use(express.static(__dirname + '/public'));

// ...

// Define routes for each game
app.use('/game1', game1.router);
app.use('/game2', game2.router);
// ...

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});