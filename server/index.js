const express = require('express');
const request = require('request');
const fsPromises = require('fs').promises;
const xmlParser = require('xml2js').parseString;
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/build'));

var xmlTree;
var names;

fsPromises.readFile('./tree.xml')
.then(res => res.toString())
.then(text => {

    const xml = xmlParser(text, (err,res) => {
        xmlTree = res;
        let files = xmlTree['files']['file'];
        let oggs = files.filter(i => i['$']['name'].includes('.ogg'));
        names = oggs.map(i => i['$']['name']);
        
    })

})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/build/index.html');
});

app.get('/files', (req,res) => {

    res.send(names);
})

app.listen(3000);