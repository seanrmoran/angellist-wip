var https = require('https');
var mongoose = require('mongoose');
var company = mongoose.model('Company');
var startup = mongoose.model('Startup');
var fs = require('fs');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.followers = function(req, res){
	var data = "";
	var followers = [];
	https.get("https://api.angel.co/1/startups/"+req.params.id+"/followers", function(response){
		response.on('data', function(chunk){
			data += chunk.toString();
		});
		response.on('end', function(){
			data = JSON.parse(data);
			data.users.forEach(function(user){
				followers.push(user.name);
			});
			res.render('index', { title: 'Followers', followers: followers });
		});
	});
};

exports.findById = function(req, res){
	startup.findOne({ id: req.params.id}, function(err, start){
		if (err) console.log(err);
		res.send(start);
	})
}

exports.findAll = function(req, res){
	var startupIds = [];
	console.log(hello);
	startup.find({}, function(err, startups){
		console.log('hi');
		if (err) console.log(err);
		startup.forEach(function(start){
			startupIds.push(start.id);
		});
		res.send(startups);
	});
}

function queryAPI(num){
	var data = "";
	console.log('request ' + num);
	var url = "https://api.angel.co/1/startups/batch?ids=";
	for (var i = num; i < num + 50; i++) {
		if (i == num + 49) {
			url += i;
		} else {
			url += i + ',';
		}
	}
	https.get(url, function(response){
		response.on('data', function(chunk){
			data += chunk.toString();
		});
		response.on('end', function(){
			data = JSON.parse(data);
			// if (data.name){
			// 	var comp = new company({
			// 		name: data.name,
			// 		joined: data.created_at
			// 	});
			// 	comp.save(function(err, docs){
			// 		if(err) console.log(err);
			// 		console.log(docs);
			// 		console.log(data.id);
			// 	});
			// }
			//if (data.success != false && data.hidden != true && data.error != "over_limit") {
			for (var i = 0; i < data.length; i++) {
				if (data[i].success != false && data[i].hidden != true && data[i].error != "over_limit") {
					var start = new startup(data[i]);
					start.save(function(err, docs){
						if (err) console.log(err);
						else console.log(docs);
					});
				}
			}
			//}
		});
	});
	setTimeout(function(){
		if (num < 10000 && data.error != "over_limit"){ //stopped 2011 queries at 10682
			queryAPI(num + 51);
		}
	}, 2000);
}

exports.populate = function(req, res){
	var i = 7926; //1501
	queryAPI(i);
	res.send('populatin');
}

exports.companies = function(req, res){
	var compList = [];
		company.find({}, function(err, companies){
			companies.forEach(function(comp){
				compList.push(comp.name);
			});
			res.render('companies', { companies: companies });
		});
}