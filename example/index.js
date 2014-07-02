var express = require('express');
var roust = require(__dirname + '/../index.js');
var app = express();

app.roust('/api/v1/', 'controllers');
app.listen(3000);