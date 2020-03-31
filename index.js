const express = require('express');
const path = require('path');

const server = express();

server.use(express.static(path.join(__dirname, '/build')));

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// const port = process.env.PORT || 80;
// server.listen(port);
// console.log(`Server is listening on port ${port}`);

module.exports = server;
