var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var iconv = require('iconv-lite');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require("./routes/api");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use("/api", api);

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

var fs   = require('fs');
var target = "file/data"
var i = 0;
fs.watchFile(target, { interval: 10 }, function (curr, prev) {
    fs.readFile(target, 'utf8', function (err, text) {
        if (err) { throw err; }
        var lines = text.toString().split('\n').length - 1 // 文字列に変換し改行で配列に分割
        console.log(lines)
    });
});

/* ここからシリアル */
var serial_mind = require('mindset-js-binary-parser')
var Serial_xbee = require("serialport").SerialPort

serial_xbee = new Serial_xbee("/dev/tty.usbserial-A700eEHf", {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});
serial_xbee.on("open", function () {

  serial_xbee.on('data', function(data) {
    data_encoded = iconv.encode(data, 'us-ascii');
    console.log('data received: ' data_encoded);
    onDataRecieved(data_encoded);
  });
});


serial_mind.open(function () {

    console.log('Serial port opened');

    serial_mind.on('data', function(data) {
    if(!data.rawEeg){

      app.set("eeg_data",data)
      send_train_speed(data.attention, data.meditation)
    }
    });

  });

/* ここまでシリアル */
/*ここから関数*/

// 列車の速度を変える
function send_train_speed(att, med){
    console.log("at: "+att+", med: "+med);
    //どうにかして車両に送る値をつくる
    serial_xbee.write("110",function(err, result){
        console.log(result)
    })
}
/*ここまで関数*/

module.exports = app;
