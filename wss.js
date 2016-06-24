const WebSocketServer = require('ws').Server;
const extend = require('util')._extend;
const init = function(app,opt){
    opt = opt||{};
    return new WebSocketServer(extend({
        server: app.server,
        port: 3336
    },opt));
};
module.exports = {
    init
};
