'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use('/dist', express.static(path.resolve(__dirname, '..', 'dist')));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(7777, () => {
  console.log('example server listen port 7777');
});