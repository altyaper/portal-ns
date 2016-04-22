var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var routes = require('./routes/index');
var app = express();
var fs = require('fs');
var keys = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
};
var http = require('https').Server(keys, app);;
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

io.on('connection', function(socket){

  current = Object.keys(io.sockets.connected).length;

  if (current < 3){

    socket.join("portal");

    io.emit("join",current);

    console.log(current + " clients");

    socket.on("message", function(desc){
      io.emit("message", desc);
    });

    socket.on("talk", function(desc){
      io.emit("talk", desc);
    });

    socket.on("quiet", function(desc){
      io.emit("quiet", desc);
    });

  } else {
    console.log("full: " + current);
    socket.emit("redirect");
  }
  socket.on("disconnect",function(){
     io.emit("refresh");
     current--;
     console.log("leaving. Current: " + current);
  });

});

app.post("/off", function(req, res){
  io.emit("quiet");
  console.log("Off");
  res.end();
});

app.post("/on", function(req, res){
  io.emit("quiet");
  console.log("On");
  res.end();
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

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
