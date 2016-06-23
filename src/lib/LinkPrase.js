/**
 * Created by Nonjene on 16/6/23.
 */

const expAddr = /\?.*/;
export function getParam( link ) {


    var param= link.split( '?' )[1];

    if(!param) return;
    
    var item = param.split( '&' );

    return item.reduce( ( pre, cur )=> {
        let foo = cur.split( '=' );
        if(foo.length<2){return}
        pre[foo[0]] = foo[1];
        return pre;
    }, {} )
}
export function getReqAddr( link ) {
    return link.replace( expAddr, '' )
}