var nodeStatic = require('node-static'),
    fileServer = new nodeStatic.Server('./static');

require('http').createServer(function(req, res) {
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
}).listen(8080);