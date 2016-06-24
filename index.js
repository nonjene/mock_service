const debug = require('./debug');
<<<<<<< HEAD
const confit = require('confit');
=======
const fs = require('fs');
>>>>>>> 9e5b86226d4a9b36fa410140b48a8caae70662d3
module.exports = debug;

if (!module.parent) {
    const Koa = require('koa');
    const app = new Koa();
<<<<<<< HEAD
    app.use(function(ctx,next){
        return next();
    });
=======
    const koaBody = require( 'koa-body' );
    app.use( koaBody( {formidable: {uploadDir: __dirname}} ) );

    app.use( function ( ctx, next ) {
        if (ctx.request.url == '/__debug_test__') {
            ctx.body = fs.readFileSync( './demo/test.html' );
            ctx.status = 200;
            ctx.type = 'text/html; charset=UTF-8';
        }else{
            return next()
        }
    } );
>>>>>>> 9e5b86226d4a9b36fa410140b48a8caae70662d3
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
