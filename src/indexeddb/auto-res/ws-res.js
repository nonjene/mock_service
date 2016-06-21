export default class WSRes {
    constructor( {dbApi, dbData, webSocket, ...opt} ) {
        this.opt = opt;
        this.dbApi = dbApi;
        this.dbData = dbData;   //这个后来修改为dataList数据了
        this.webSocket = webSocket;
        if(opt.turnOn){
            this.turnOn();
        }
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
        /*this.dbData.promiseOpenStore
            .then( db=>db.readOne( id ) )
            .then( data=>this.sendMsg(data) );*/
        this.sendMsg(
            this.dbData.filter(item=>{
                if(item.id===id){
                    return true
                }
            })
        )
    }

    sendMsg( data ) {
        this.webSocket.send( JSON.stringify( {
            body: data.body,
            id: this.socketID
        } ) );
    }
    turnOn(){
        this.webSocket.onmessage = this.getMsg.bind( this )
    }
    turnOff(){
        this.webSocket.onmessage = null
    }
    onNoApiFound(){}
};