/**
 * Created by Nonjene on 16/6/2.
 */


import React from "react";
import DBHandler from "./db-handler";
import {CardPiece} from "./card.jsx";
import css from "./css.scss";

const SampleData= {
    name: "/sampleProject/sampleApi",
    desc: '接口描述',
    choose: 'ok',
    ok: {rcode: 0, msg: "成功", data: {}},
    fail: {rcode: 1, msg: "失败", data: {}},
    fail201: {rcode: 201, msg: "其他失败类型", data: {}},
    need: {param1: 'string', param2: 'number'}
};

function stringToJSON( name, str ) {
    var out;
    if(typeof str !=='string'){
        out = str;
        out.name = name;
        return out;
    }
    try {
        out = JSON.parse( str.replace( /([a-zA-Z0-9]+) *:/gi, function ( ...arg ) {
            return '"' + arg[1] + '":'
        } ) );

        if(!name){
            throw new Error('请填写接口地址')
        }else{
            out.name = name;
        }

    } catch ( e ) {
       out = e.toString()
    }
    return out;

}

export class IndexedDB extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            aData: [],
            msg:''
        }
    }

    componentDidMount() {
        this.db = new DBHandler({
            storeName: this.props.storeName,
            keyPath:this.props.keyPath,
            openStore:'instant',
            initStoreData: SampleData
        });
        this.getList(aData=>this.setState( {aData: aData}));
    }
    setMsg(msg){
        this.setState( {
            msg:msg
        } );
        if(this.setTimeoutID){
            clearTimeout( this.setTimeoutID );
        }
        this.setTimeoutID = setTimeout(()=>{
            this.setState( {
                msg: ''
            } );
        },3000);
    }
    commitContent( name, content ) {
        var db = this.db;
        var o = stringToJSON( name, content );
        if (typeof(o) == 'string') {
            return alert( o )
        }
        db.promiseOpenStore
            .then( thisDB=>thisDB.writeOne( o.name, o))
            .then( ()=>this.setMsg( '保存成功~' ) );
    }

    delContent(name){
        //不知为何,执行删除实际不存在的key值, 居然是触发了success(昨天还是触发error的。。)。所以只能先读一下看是否存在。
        this.db.promiseOpenStore
            .then( db=>db.readOne( name ) )
            .then( ()=>this.db.removeData( name ) )
            .then( ()=> {
                //完成删除
                this.getList( aData=>this.setState( {aData: aData} ) );
                //提示
                this.setMsg( '删除成功~' )

            } ).catch( ()=>this.delEmpty() );
    }

    useContent(name,content){
        this.props.instantUse( stringToJSON( name, content ) )
    }

    delEmpty(){
        var add = this.state.add || 1;
        this.setState( {add: --add} );
    }
    getList(callback){
        if(!this.db){return console.error('db not yet connect!')}
        this.db.promiseOpenStore
            .then( thisDB=>thisDB.readAll() )
            .then( aData=>callback( aData ) );
    }

    newOne() {
        var add = this.state.add ||0;
        this.setState({add:++add});
    }
    renderList(){
        var render = this.state.aData.map( oriItem=>{
            let item = Object.assign({}, oriItem);
            let name = item.name || '';
            let key = name.toString().replace('/','');
            delete item.name;

           return <CardPiece content={JSON.stringify(item)}
               name={name}
               key={key}
               commitContent={this.commitContent.bind( this )}
               delContent={this.delContent.bind( this )}
               useContent={this.useContent.bind( this )}
           />
        });
        if(this.state.add){
            for(let i=0;i<this.state.add;i++){
                render.unshift(<CardPiece
                    key={'temporary'+i}
                    commitContent={this.commitContent.bind( this )}
                    delContent={this.delContent.bind( this )}
                    useContent={this.useContent.bind( this )}

                />)
            }
        }

        return render;

    }

    render() {
        var dressedChildren = React.Children.map( this.props.children, _addProps.bind( this ) );
        return (
            <div className={css.dbWrap}>
                {dressedChildren}
                <div className={css.dbMsg}>{this.state.msg}</div>
                <div className={css.cardWrap}>
                    {this.renderList()}
                </div>
            </div>

        );
    }
}

IndexedDB.defaultProps = {
    keyPath:'id',
    storeName:'foo'
};
IndexedDB.propTypes={
    keyPath: React.PropTypes.string.isRequired,
    storeName: React.PropTypes.string.isRequired
};

function _addProps( child ) {
    return React.cloneElement( child, {
        handler: {
            commitContent: this.commitContent.bind( this ),
            newOne:this.newOne.bind(this)
        }
    } )
}


