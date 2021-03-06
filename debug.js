const q = require('q');


const initWSS = require('./wss').init;
const redis = require('redis');

const regIP = /^\:\:[a-zA-Z]*\:*/;

function debug(opt) {

    function waitForResponse(ctx, broadcast) {
        var defer = q.defer();
        var id = (Math.random() * 1E8) | 0;
        redisClient.set(id, "__status_ready");
        redisClient.expireat(id, parseInt(Date.now() / 1000) + 100);
        broadcast(JSON.stringify({
            request: ctx.request,
            id: id,
            param: ctx.body
        }), ctx.ip);
        var repeater = setInterval(function() {
            redisClient.get(id, function(err, value) {
                if (value === "__status_ready") {
                    //continue
                } else if (value === null) {
                    clearInterval(repeater);
                    defer.resolve(undefined);

                } else {
                    clearInterval(repeater);
                    const json = JSON.parse(value);
                    redisClient.expireat(id, 0);
                    if (typeof json === "object") {
                        defer.resolve(json.body);
                    } else {
                        defer.resolve(undefined);
                    }

                }
            });
        }, 5E2);
        return defer.promise;
    }

    function asyc(broadcast, ctx, next) {
        return waitForResponse(ctx, broadcast).then(function(value) {
            if (value !== undefined) {
                ctx.body = value;
                return;
            }
            return next();
        });
    }
    const wsOpt = opt.webSocketConfig || {};
    const redisOpt = opt.redisConfig || {};
    const redisClient = redis.createClient(redisOpt);

    const serve = require('koa-static');
    const Koa = require('koa');
    const admin = new Koa();
    const compress = require('koa-compress');
    const conditional = require('koa-conditional-get');
    const etag = require('koa-etag');
    const proxy = require('koa-proxy');


    admin.use(compress({
        flush: require('zlib').Z_SYNC_FLUSH
    }));
    admin.use(conditional());
    admin.use(etag());
    admin.use(serve(__dirname + '/admin/', {
        maxage: 31536000000
    }));

    admin.use(proxy({
        host: 'http://127.0.0.1:'+opt.servicePort,
        match: /^\/.+$/
    }));

    admin.listen(opt.adminPort || 8081);
    const wss = initWSS(admin, wsOpt);
    wss.on('connection', function connection(ws) {
        //把打开后台的ip发过去。
        ws.send(JSON.stringify({
            _conf_: {
                ip: ws._socket.remoteAddress
            }
        }));

        ws.on('message', function(data) {
            try {
                const json = JSON.parse(data);
                var id;
                if (json && json.id) {
                    id = json.id;
                    redisClient.set(id, data);
                } else if (json && json._conf_) {
                    //接收后台发来的监听ip
                    ws.cus_listenIP = json._conf_.ip;
                }
            } catch (e) {}
        });

        ws.on('close', function() {
            ws.cus_listenIP = null;
        });
    });

    function broadcast(data, ip) {
        if (typeof ip !== 'string') {
            return console.log('err:ip is not a string');
        }

        wss.clients.forEach(function each(client) {
            //把 "IPv4-mapped IPv6" 转为ipv4
            var backStageIp = ip.replace(regIP, '');
            if (backStageIp === '1') {
                backStageIp = '127.0.0.1';
            }

            //同一个ip或设置了ip
            if (client._socket.remoteAddress === backStageIp || client.cus_listenIP === backStageIp) {
                client.send(data);
            }
        });

    }
    return function(ctx, next) {
        return asyc(broadcast, ctx, next);
    };
}

module.exports = debug;
