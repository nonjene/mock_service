const debug = require('./debug');
const path = require('path');
const fs = require('fs');
module.exports = debug;

if (!module.parent) {
    const Koa = require('koa');
    const confit = require('confit');
    const app = new Koa();
    const koaBody = require('koa-better-body');
    const basedir = path.join(__dirname, 'config');
    confit(basedir).create(function(err, config) {
        if (err) {
            throw err;
        }
        app.use(koaBody());
        app.use(debug({
            webSocketConfig: config.get("webSocketConfig") || {},
            redisConfig: config.get("redisConfig") || {
                port: 3336
            },
            adminPort: config.get("adminPort")
        }));
        app.use(function(ctx, next) {
            ctx.body = "not found";
            ctx.status = 404;
        });
        app.listen(config.get("port") || 3000);
    });
}
