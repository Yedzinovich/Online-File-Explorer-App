//modules
const http = require('http');

//file imports
const respond = require('./lib/respond.js');

//connections
const port = process.env.PORT || 3000; 


//Create server
const server = http.createServer(respond);
server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});