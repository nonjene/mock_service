const debug = require('./debug');
const confit = require('confit');
module.exports = debug;

if (!module.parent) {
    const Koa = require('koa');
    const app = new Koa();
    app.use(function(ctx,next){
        return next();
    });
    app.use(debug({
        host: "192.168.6.73",
        port: 3336,
        path: "fe-debug-service"
    }));
    app.use(function(ctx,next){
        ctx.body="not found";
        ctx.status=404;
    });
    app.listen(3000);
}
