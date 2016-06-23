const debug = require('./debug');
const fs = require('fs');
module.exports = debug;

if (!module.parent) {
    const Koa = require('koa');
    const app = new Koa();
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
    app.use(debug({
        port: 3336
    }));
    app.use(function(ctx,next){
        ctx.body="not found";
        ctx.status=404;
    });
    app.listen(3000);
}
