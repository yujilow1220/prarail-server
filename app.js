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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
        var data_encoded = iconv.encode(data, 'us-ascii');
        onDataRecieved(data_encoded)
  });
});

test();

function test(){


}

var prarail_charset = ["(", ")", "*", "+", ",", "-", ".", "/", "0","1","2","3","4","5"];
var station_charset = ["a", "b", "c", "d", "e", "f", "g", "h", "i","j"];


//necomimi 主に送信側
serial_mind.open(function () {

    console.log('Serial port opened');
    serial_mind.on('data', function(data) {
    if(!data.rawEeg){
      app.set("eeg_data",data)

      var prevSpeed = module.exports.set('prev_speed') //前のスピードをだして
      var nextSpeed = get_train_speed(data.attention, data.meditation) //次のスピードを計算する
      console.log(data.poorSignal)

      if(true || nextSpeed != prevSpeed){
        var sendData = nextSpeed
        //sendData = prarail_charset[6]
        serial_xbee.write(sendData)
        console.log("emitted. :"+sendData)
        app.set("prev_speed", nextSpeed)
        //app.set("speed", prarail_charset.indexOf(nextSpeed));
        console.log(prarail_charset.indexOf(nextSpeed))
      }
    }
    });

  });

/* ここまでシリアル */
/*ここから関数*/

// 列車の速度を変える -3,-2,-1,0,1,2,3
function get_train_speed(att, med){
    var speed = 0;
    console.log("at: "+att+", med: "+med);
    //どうにかして車両に送る値をつくる
    var unit = 100/7;
    if(between(att,unit*0,unit*1))speed = prarail_charset[0];
    if(between(att,unit*1,unit*2))speed = prarail_charset[1];
    if(between(att,unit*2,unit*3))speed = prarail_charset[2];
    if(between(att,unit*3,unit*4))speed = prarail_charset[3];
    if(between(att,unit*4,unit*5))speed = prarail_charset[4];
    if(between(att,unit*5,unit*6))speed = prarail_charset[5];
    if(between(att,unit*6,unit*7))speed = prarail_charset[6];
    return speed;
}

function between(data,down,up){
    if(data < up && data > down) return true;
    else return false;
}

//データ受信時に呼び出す関数
//dataは10進数の数値と予想される
function onDataRecieved(data){
//    var data_2 = data.toString(2)
    var data_str = data.toString()
    console.log("data recieved: "+data_str)
    if(data_str.charCodeAt(0) < 60 && data_str.charCodeAt(0) > 32){
        console.log("prarail")
        app.set("speed",data_str)
    }
    else if(data_str.charCodeAt(0) > 96){
        app.set("place", data_str);
        console.log("station")

    }
//    var parse = parseData(data_2);

}
/*ここまで関数*/


module.exports = app;
