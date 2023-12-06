// Create web server
//-------------------------------------------------------------
// 1. Create web server
// 2. Set the port number
// 3. Start the server
//-------------------------------------------------------------
// 1. Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

// 2. Set the port number
app.set('port', 3000);

// 3. Start the server
app.listen(app.get('port'), function() {
    console.log('Server has started on port: ' + app.get('port'));
});

// 4. Set static directory
app.use(express.static('public'));

// 5. Set body-parser
app.use(bodyParser.urlencoded({extended: false}));

// 6. Create a connection pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'nodejs',
    password: '1234'
});

// 7. Set view engine
app.set('view engine', 'jade');
app.set('views', './views_mysql');

// 8. Set routing
app.get('/topic/add', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    pool.query(sql, function(err, topics, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add', {topics: topics});
    });
});

app.post('/topic/add', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
    var params = [title, description, author];
    pool.query(sql, params, function(err, result, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/' + result.insertId);
    });
});

app.get(['/topic/:id/edit'], function(req, res) {
    var sql = 'SELECT id, title FROM topic