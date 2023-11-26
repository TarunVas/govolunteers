const express = require('express')
const path = require('path')
const res = require('express/lib/response')
const app = express()
const bodyparser=require('body-parser')
var session = require('express-session')


app.use(session({secret: "some", resave: true, saveUninitialized: true}));
app.use(bodyparser.urlencoded({ extended : true}));
app.set('view engine', 'ejs');

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));

app.use('/',require('./server/routes/router'));
//app.use('/',require('./server/queries/query'));
app.listen(3000)