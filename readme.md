#動作の前に

node_module/mindset-js-binary-parser/index.js内部にハードコーディングされているシリアルポートを書き換える。


##変更履歴

###2014/11/13
* NeuroSkyのパーサを導入。以下のapiで出力できます。
  * /api/eeg
  * 出力結果: { poorSignal: 0,delta: 1974090,theta: 413517,lowAlpha: 219749,highAlpha: 50232,lowBeta: 154755,highBeta: 67392,lowGamma: 47800,highGamma: 38938,attention: 7,meditation: 75 }
* 出力形式に若干の変更が出ました。ご確認ください。
* 

##TODO
* 列車運行情報を受信する
