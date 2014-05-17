var https = require('https');
var mongoose = require('mongoose');
var company = mongoose.model('Company');
var startup = mongoose.model('Startup');
var fs = require('fs');

exports.index = function(req, res){
  res.render('search');
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
	});
}

exports.findByName = function(req, res){
	var regex = new RegExp(req.params.name, 'i');
	startup.find({ name: regex }, function(err, startups){
		res.send(startups);
	});
}

exports.searching = function(req, res) {
	res.send(req.body);
	// if (req.body.name != null) {
	// 	var nameReg = new RegExp(req.params.name, 'i');
	// }
	// if (req.body.location != null) {
	// 	var locReg = new RegExp(req.params.name, 'i');
	// }
	// startup.find({ name: nameReg }, function(err, startups){
	// 	res.send(startups);
	// });
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
			for (var i = 0; i < data.length; i++) {
				if (data[i].success != false && data[i].hidden != true && data[i].error != "over_limit") {
					var start = new startup(data[i]);
					start.save(function(err, docs){
						if (err) console.log(err);
					});
				}
			}
		});
	});
	setTimeout(function(){
		if (num < 400000 && data.error != "over_limit"){
			queryAPI(num + 51);
		}
	}, 2000);
}

exports.populate = function(req, res){
	var i = 295663;
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