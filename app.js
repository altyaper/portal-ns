'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var port = process.env.PORT || 5000;
var room = process.env.room || 'portal';

var routes = require('./routes/index');
var app = express();
var remote = require('./remote/control.js');
// var fs = require('fs');
// This is useful just in development env.
// var keys = {
//   key: fs.readFileSync('ssl/key.pem'),
//   cert: fs.readFileSync('ssl/cert.pem')
// };
var http = require('http').Server(app);
var io = require('socket.io')(http);

var current = 0;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

io.on('connection', function(socket) {

    socket.on('room', function(room) {

        socket.join(room);

        current = io.nsps['/'].adapter.rooms[room].length;

        if (current < 3) {

            io.sockets.in(room).emit('join', current);

            socket.on('message', function(desc) {
                io.sockets.in(room).emit('message', desc);
            });

            socket.on('talk', function(desc) {
                io.sockets.in(room).emit('talk', desc);
            });

            socket.on('quiet', function(desc) {
                io.sockets.in(room).emit('quiet', desc);
            });

            socket.on('refresh', function() {
                io.sockets.in(room).emit('refresh');
            });

        } else {
            socket.emit('redirect', current);
            //is useless go to the 'disconnect' listener when current>=3
            return;
        }

    });

    socket.on('disconnect', function() {
        io.sockets.in(room).emit('refresh');
        socket.leave(socket.room);
    });

});

app.get('/r/:room', function(req, res) {
    var room = req.param('room');
    res.render('portal', {title: 'Test', room: room});
});

app.post('/off', function(req, res) {
    var message = remote.getActionMessage(req.body.token, '/off');
    if(message.status === 200) {
        io.sockets.in(room).emit('quiet');
    }
    res.json(message);
});

app.post('/on', function(req, res) {
    var message = remote.getActionMessage(req.body.token, '/on');
    if(message.status === 200) {
        io.sockets.in(room).emit('talk');
    }
    res.json(message);
});

http.listen(port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
