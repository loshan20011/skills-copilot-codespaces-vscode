// Create web server

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var query = url.parse(request.url, true).query;

    if (request.method == 'GET') {
        if (path == '/comments') {
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            fs.readFile('comments.txt', 'utf8', function(err, data) {
                if (err) {
                    response.end('error');
                } else {
                    response.end(data);
                }
            });
        } else {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found\n');
        }
    } else if (request.method == 'POST') {
        if (path == '/comments') {
            response.writeHead(200, { 'Content-Type': 'text/plain' });

            var postData = '';
            request.on('data', function(chunk) {
                postData += chunk;
            });

            request.on('end', function() {
                var comment = qs.parse(postData).comment;
                fs.appendFile('comments.txt', comment + '\n', function(err) {
                    if (err) {
                        response.end('error');
                    } else {
                        response.end('ok');
                    }
                });
            });
        } else {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found\n');
        }
    } else {
        response.writeHead(405, { 'Content-Type': 'text/plain' });
        response.end('405 Method Not Allowed\n');
    }
}).listen(8124);

console.log('Server running at http://')