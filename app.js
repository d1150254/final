var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hackRouter = require('./routes/hack');
var loginRouter = require('./routes/login');

const sqlite3=require('sqlite3').verbose();
const db=new sqlite3.Database('public/sqlite.db', (err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("connect to db");
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hack', hackRouter);
app.use('/login', loginRouter);

module.exports = app;

app.get('/api/stockdata', (req, res) => {
    if(req.query.stock){
        const stock=req.query.stock;
        console.log(stock);
        db.all('select * from stock where stockid='+stock, (err,rows)=>{
            if(err){
                return console.error(err.message);
            }
            console.log(rows);
            res.json(rows);
        });
    }
});

app.get('/api/logindata', (req, res) => {
    if(req.query.username && req.query.password){
        const username=req.query.username;
        const password=req.query.password;
        console.log(username,password);
        var sql='insert into login (account,password) values(?,?)';
        db.run(sql,[username,password],(err)=>{
            if(err){
                return console.error(err.message);
            }
            console.log('insert success');
            
        });
    }
    else{
        db.all('select * from login', (err,rows)=>{
            if(err){
                return console.error(err.message);
            }
            console.log(rows);
            res.json(rows);
        });
    }
});
