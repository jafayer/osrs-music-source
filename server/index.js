const express = require('express');
const request = require('request');
const fs = require('fs');
const xmlParser = require('xml2js').parseString;
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('../build'));

app.get('/:song?', (req, res) => {
    const indexFile = path.resolve('../build/index.html');
    fs.readFile(indexFile,'utf8',(err,data) => {
        if(err) {
            console.log('Yikes! ',err);
            res.status(500).send('Yikes, there was an error!');
        }

        return res.send(
            data
        )
    });
});

app.get('/files', (req,res) => {

    res.send(names);
})

app.listen(8863);