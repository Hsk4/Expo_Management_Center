const http = require('http');
const app = require('./src/app');
const connectDb = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// connection to mongo db
connectDb();

// create HTTP server 
const server = http.createServer(app);

// listen for requests

server.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})