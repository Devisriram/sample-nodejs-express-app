const express = require('express')
const app = express()
const port = 8000

app.get("/", (req, res) => {
    res.send('Hellow World!.. how an i');
 });

app.get("/helo", (req, res) => {
    res.send('Hellow World!.. how an i');
 }); 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
 });