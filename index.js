var express = require('express'); 
var bodyParser = require('body-parser')
var WebClient = require('@slack/client').WebClient
var app = express();
var slack = new WebClient(process.env.SLACK_TOKEN);
var sibs = [];
var skipping = [];
var lunch = [];
var gather = [];
var both = []
var breakfast = [];

var question = {  
	    attachments:[
	        {
	            text: "Help us save on food costs by letting us know what food you'll be needing.",
	            callback_id: "food",
	            color: "#3AA3E3",
	            attachment_type: "default",
	            actions: [
	                {
	                    "name": "lunch only",
	                    "text": "Skipping lunch",
	                    "type": "button",
	                    "value": "lunch"
	                },
	                {
	                    "name": "gather only",
	                    "text": "Skipping Gather Hour",
	                    "type": "button",
	                    "value": "gather"
	                },
	                {
	                    "name": "breakfast only",
	                    "text": "Skipping Breakfast",
	                    "type": "button",
	                    "value": "breakfast"
	                },
	                {
	                    "name": "gather_lunch",
	                    "text": "Feed me all!",
	                    "style": "primary",
	                    "type": "button",
	                    "value": "both"
	                },
	                {
	                    "name": "skipping",
	                    "text": "Skipping all!",
	                    "style": "danger",
	                    "type": "button",
	                    "value": "skipping"
	                }
	            ]
	        }
	    ]
	};
var botbot = slack.chat.postMessage('#general', 'I\'m here to help reduce food waste and donate the savings to local charities!', question, function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});

app.use(bodyParser.urlencoded({ extended: false}))
app.post('/action', function (req, res) {
	var response = Object.assign({}, question);
	var payload = JSON.parse(req.body.payload);
    var action = payload.actions[0].value;
    console.log(action);

    switch (action) {
    	case 'lunch':
    	  if (lunch.indexOf(payload.user.id) === -1) {
    	  	lunch.push(payload.user.id);
    	  	console.log(lunch);
    	  }
    	  break;
    	case 'gather':
    	  if (gather.indexOf(payload.user.id) === -1) {
    	  	gather.push(payload.user.id);
    	  	console.log(gather);
    	  }
    	  break;
    	case 'breakfast':
    	  if (breakfast.indexOf(payload.user.id) === -1) {
    	  	breakfast.push(payload.user.id);
    	  	console.log(breakfast);
    	  }
    	  break;
    	case 'both':
    	  if (both.indexOf(payload.user.id) === -1) {
    	  	both.push(payload.user.id);
    	  	console.log(both);
    	  }
    	  break;
    	case 'skipping':
    	  if (skipping.indexOf(payload.user.id) === -1) {
    	  	skipping.push(payload.user.id);
    	  	console.log(skipping);
    	  }
    	  break;
    }
	// check value that is being returned 
	// case switch -> to match value
	// push to whatever array matches the value

	// check if user id already in array
	if (sibs.indexOf(payload.user.id) === -1) {
		sibs.push(payload.user.id);	
	}
	response.text = "You\'ve helped donate over $" + ((gather.length*15)+(lunch.length*15)+(breakfast.length*15)+(skipping.length*45)) + " to charity."  
	// console.log("Skipping lunch: " + lunch.length);
	// console.log("Skipping gather: " + gather.length);
	// console.log("Skipping breakfast: " + breakfast.length);
	// console.log("Skipping all: " + skipping.length)
	// console.log(req.body);
	res.send(response);
});
app.listen(8080);

var CronJob = require('cron').CronJob;
var job = new CronJob('30 2 3 * * 1-5', botbot, null, true, 'America/Los_Angeles');

job.start();



















