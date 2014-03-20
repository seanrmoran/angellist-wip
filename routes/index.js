var https = require('https');
var mongoose = require('mongoose');
var company = mongoose.model('Company');

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

function queryAPI(num){
	var data = "";
	https.get("https://api.angel.co/1/startups/"+num, function(response){
		response.on('data', function(chunk){
			data += chunk.toString();
		});
		response.on('end', function(){
			data = JSON.parse(data);
			if (data.name){
				var comp = new company({
					name: data.name,
					joined: data.created_at
				});
				comp.save(function(err, docs){
					if(err) console.log(err);
					console.log(docs);
				});
			}
		});
	});
}

exports.populate = function(req, res){
	var i = 1500;
	while (i > 0) {
		queryAPI(i);
		i--;
	}
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