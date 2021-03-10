const express = require('express');
const request = require('request');
const fsPromises = require('fs').promises;
const xmlParser = require('xml2js').parseString;
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/build'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/build/index.html');
});

app.get('/files', (req,res) => {

    res.send(names);
})

app.listen(80);