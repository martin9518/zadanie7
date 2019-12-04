const path = require('path');
const express = require('express');


const app = express();
const port = 3000;

const pathtostaticfile =path.join(__dirname,"page");

app.use(express.static(pathtostaticfile));
const indexHtml=path.join(__dirname,"page","zadanie6.html")
app.get('/', (req, res) => res.sendfile(indexHtml))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const pathToHtml = path.join (__dirname, "./page/index.html");
console.log(pathToHtml);