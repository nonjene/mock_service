/**
 * Created by Nonjene on 16/7/2.
 */

export function initWs( port='3336'){
    var ws = new WebSocket( 'ws://' + window.location.hostname + ':'+port );

    //这还没有解绑功能,
    ws.onmessageCallbackSlot = [];
    ws.onmessage = function ( data ) {
        ws.onmessageCallbackSlot.forEach( func=>func( data ) );
    };
    ws.on = function ( eve, func ) {
        if (eve == 'message') {
            if (!ws.onmessageCallbackSlot) {
                ws.onmessageCallbackSlot = [];
            }
            ws.onmessageCallbackSlot.push( func );
        }
    };
    return ws;
}