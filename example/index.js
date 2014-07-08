var express = require('express');
var roust = require(__dirname + '/../index.js');
var app = express();

app.roust('/api/v1', [__dirname + '/controllers', __dirname + '/includes']);
app.listen(3000);