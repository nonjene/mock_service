export default class WSRes {
    constructor( {dbApi, dbData, webSocket, ...opt} ) {
        this.opt = opt;
        this.dbApi = dbApi;
        this.dbData = dbData;
        this.webSocket = webSocket;
        webSocket.onmessage = this.getMsg.bind(this);
    }

    getMsg( data ) {
        data = JSON.parse( data.data );
        let url = data.request.url;
        this.socketID = data.id;

        this.dbApi.promiseOpenStore
            .then( db=>db.readAll() )
            .then( data=>this.getData( data.filter( item=>item.addr === url || item.addr+'/' === url )[0] ) );
    }

    getData( route ) {
        if(!route){
            return this.onNoApiFound()
        }
        var id = route.target_id;
        this.dbData.promiseOpenStore
            .then( db=>db.readOne( id ) )
            .then( data=>this.sendMsg(data) );
    }

    sendMsg( data ) {
        this.webSocket.send( JSON.stringify( {
            body: data,
            id: this.socketID
        } ) );
    }

    onNoApiFound(){}
};