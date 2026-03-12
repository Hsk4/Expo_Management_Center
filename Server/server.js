require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const connectDb = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// connection to mongo db
connectDb();

// create HTTP server 
const server = http.createServer(app);

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port or stop the other process.`);
    } else {
        console.error('❌ Server error:', error.message);
    }
    process.exit(1);
});

// listen for requests
server.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});
