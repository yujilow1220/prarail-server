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
	res.send({
		distance: 30,
		place: 1,
		speed: module.parent.exports.set('speed')*10
	})
})


module.exports = router;
