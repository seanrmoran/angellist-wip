var https = require('https');

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