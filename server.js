const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8888;

const server = http.createServer(app);

// Base Url of Back End `http:localhost:8888`

server.listen(port,() => {
    console.log('server is up on port 8888 !!')
});