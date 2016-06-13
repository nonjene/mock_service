const debug = require('./debug');
module.exports = debug;

if (!module.parent) {
    const Koa = require('koa');
    const app = new Koa();
    app.use(debug({
        port: 3336
    }));
    app.use(function(ctx,next){
        ctx.body="not found";
        ctx.status=404;
    });
    app.listen(3000);
}
