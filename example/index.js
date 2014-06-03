var express = require('express');
var roust = require(__dirname + '/../index.js');
var app = express();

app.use(roust());
app.listen(3000);