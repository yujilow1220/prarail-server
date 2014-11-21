var express = require('express');
var router = express.Router();


/*

root{
	EEG{
		raw{
			return JSON {
				delta: int,
				theta: int,
				lowalpha: int,
				highalpha: int,
				lowbeta: int,
				highbeta: int,
				lowgamma: int,
				midgamma: int
			}
		}
		eSence{
			return JSON{
				attention: int,
				meditation: int
			}
		}
	}
	prarail{
		place{
			return int 1-3 //直前通過駅番号
		}
		speed{
			return float [km/h]
		}

	}
}


*/

/* GET home page. */
router.get('/', function(req, res) {
  res.send("api");
});

/* EEG API*/
router.get("/EEG", function(req, res){

	// res.send({
	// 	delta:1000,
	// 	theta:87401,
	// 	lowalpha:18124,
	// 	highalpha:4540,
	// 	lowbeta:9201,
	// 	highbeta:9723,
	// 	lowgamma:4934,
	// 	midgamma:1314,
	// 	attention: 12,
	// 	meditation: 30
	// })
	 res.send(module.parent.exports.set('eeg_data'));
})

router.get("/prarail", function(req, res){
	var place_raw = module.parent.exports.set('place')
	var place_send;
	var speed = module.parent.exports.set('speed')*10;
	if(speed < 0 )speed = 0;
	if(place_raw == "a"){
		place_send = "調布駅"
	}else if(place_raw == "d"){
		place_send = "明大前駅"
	}else if(place_raw == "g"){
		place_send = "新宿駅"
	}
	res.send({
		distance: 30,
		place: place_send,
		speed: speed
	})
})


module.exports = router;
