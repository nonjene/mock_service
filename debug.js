const koa = require('koa');
const q = require('q');

function waitForResponse(ctx, broadcast, redis) {
    var defer = q.defer();
    var id = (Math.random() * 1E8) | 0;
    redis.set(id, "__status_ready");
    redis.expireat(id, parseInt((+new Date) / 1000) + 100);
    broadcast(JSON.stringify({
        request: ctx.request,
        id: id
    }), ctx.ip);
    var repeater = setInterval(function() {
        redis.get(id,function(err, value){
            if (value === "__status_ready") {
                return;
            } else if (value === null) {
                clearInterval(repeater);
                defer.resolve(undefined);
                return;
            } else {
                clearInterval(repeater);
                const json = JSON.parse(value);
                if(typeof json === "object"){
                    defer.resolve(json.body);
                }else{
                    defer.resolve(undefined);
                }
                return;
            }
        });
    }, 5E2);
    return defer.promise;
}

function asyc(broadcast, redis, ctx,next) {
    return waitForResponse(ctx, broadcast, redis).then(function(value) {
        if(value!==undefined){
            ctx.body = value;
            return;
        }
        return next();
    });
}

const initWSS = require('./wss').init;
const redis = require('redis');

const regIP = /^\:\:\S+\:/;

function debug(wsOpt,redisOpt){
    const redisClient = redis.createClient(redisOpt);

    const serve = require('koa-static');
    const Koa = require('koa');
    const admin = new Koa();
    admin.use(serve(__dirname + '/admin/'));
    admin.listen(8081);
    const wss = initWSS(admin,wsOpt);
    wss.on('connection', function connection(ws) {
        ws.on('message', function(data) {
            try{
                const json = JSON.parse(data);
                var id;
                if(json && json.id){
                    id = json.id;
                    redisClient.set(id,data);
                }
            } catch (e) { }
        });
    });
    function broadcast(data,ip) {
        if (typeof ip !== 'string') {return console.log( 'err:ip is not a string' )}

        wss.clients.forEach(function each(client) {
            if(client._socket.remoteAddress===ip.replace( regIP,'')){
                client.send( data );
            }
        });

    }
    return function(ctx,next) {
        return asyc(broadcast, redisClient, ctx,next);
    };
}

module.exports = debug;
