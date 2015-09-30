var http = require('http'),
crypto = require('crypto'),
shasum = crypto.createHash('sha1');

var conf = require('./conf');

var postData = {
	codecType: 'Audio'
},
// urlPath = '/VS.WebAPI.Admin/json/syncreply/admin.codecs.list',
urlPath = '/VS.WebAPI.Admin/json/syncreply/AdminLogOn',

username = conf.username,
password = conf.password,
hostname = conf.hostname;

shasum.update(password);

var hashPassword = shasum.digest('hex'),
auth = (new Buffer(username+'#admin:'+hashPassword)).toString('base64');

makeRequest(postData, urlPath);

function makeRequest( postParam, urlPath ){
	var postDataJson = JSON.stringify(postParam);

	var request = http.request({
		hostname: hostname,
		port: '80',
		path: urlPath,
		method: 'POST',
		headers: {
			'Content-Type' : 'application/json',
			'Content-Length' : postDataJson.length,
			'User-Agent': 'curl',
			'Authorization' : 'Basic '+auth
		}
	}, function(response){
		var chunks = [];
		
		console.log('statusCode: '+response.statusCode);
		console.log('response headers:');
		console.log(response.headers);
		
		response.on('data', function(chunk){
			chunks.push(chunk);
		}).on('end', function(){
			console.log('request headers:');
			console.log(request._headers);
			
			console.log(Buffer.concat(chunks).toString());
		});
	});
	
	request.on('error', function(err){
		console.log('--err--');
		console.log(err);
	}).on('close', function(code){
		console.log('--close--');
		console.log(code);
	});
	
	request.write(postDataJson);
	request.end();
}