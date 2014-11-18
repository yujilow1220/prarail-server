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
        var data_encoded = iconv.encode(data, 'us-ascii');
        console.log(data_encoded)
        onDataRecieved(data_encoded)
  });
});


serial_mind.open(function () {

    console.log('Serial port opened');
    serial_mind.on('data', function(data) {
    if(!data.rawEeg){
      app.set("eeg_data",data)

      var prevSpeed = module.parent.exports.set('prev_speed') //前のスピードをだして
      var nextSpeed = get_train_speed(data.attention, data.meditation) //次のスピードを計算する

      if(nextSpeed != prevSpeed){
        console.log("ns = "+nextSpeed)
        var sendData = getSendData(nextSpeed)
        serial_xbee.write(sendData)
        app.set("prev_speed", nextSpeed)
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
    return speed;
}

//データ受信時に呼び出す関数
//dataは10進数の数値と予想される
function onDataRecieved(data){
    var data_2 = data.toString(2)
    console.log("data_2 = "+data_2)
    var parse = parseData(data_2);

}

function parseData(data){

}
/*ここまで関数*/
//設定スピードから送るデータ型に変形する
function getSendData(speed_dc){
    var FROM_SERVER = "1"
    var RAIL_NUM = "0" //使用サーバによって0か1か
    //符号ビット
    var speed_bi_pm = 0;
    if(speed_dc < 0)speed_bi_pm = 1;
    //絶対値にしないと値がおかしくなる
    var speed_bi = Math.abs(speed_dc).toString(2)
    var send = FROM_SERVER+RAIL_NUM+speed_bi_pm+speed_bi;
    return send;

}


module.exports = app;
