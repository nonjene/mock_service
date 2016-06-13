import React from 'react';



import DBHandler from "./db-handler";
import ListWrap from "./list.jsx";

import css from "./db-list.scss";



const SampleData = {
    "id":"111",
    "desc": "描述",
    "slug": "string",
    "body": {rcode:0,msg:"success",data:[]}
};


export class DBList extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            aData: [],
            msg: ''
        }
    }

    componentDidMount() {
        this.db = new DBHandler( {
            storeName: this.props.storeName,
            keyPath: this.props.keyPath,
            openStore: 'instant',
            initStoreData: SampleData
        } );
        this.getList( aData=>this.setState( {aData: aData} ) );


        document.getElementById( 'add' ).onclick = function ( e ) {
            alert('add')
        };
    }

    setMsg( msg ) {
        this.setState( {
            msg: msg
        } );
        if (this.setTimeoutID) {
            clearTimeout( this.setTimeoutID );
        }
        this.setTimeoutID = setTimeout( ()=> {
            this.setState( {
                msg: ''
            } );
        }, 3000 );
    }

    commitContent( name, o ) {
        var db = this.db;
        if (typeof(o) == 'string') {
            return alert( o )
        }
        db.promiseOpenStore
            .then( thisDB=>thisDB.writeOne( o.name, o ) )
            .then( ()=>this.setMsg( '保存成功~' ) );
    }

    delContent( name ) {
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

    useContent( name, content ) {
        this.props.instantUse( content.body)
    }

    delEmpty() {
        var add = this.state.add || 1;
        this.setState( {add: --add} );
    }

    getList( callback ) {
        if (!this.db) {return console.error( 'db not yet connect!' )}
        this.db.promiseOpenStore
            .then( thisDB=>thisDB.readAll() )
            .then( aData=>callback( aData ) );
    }

    newOne() {
        var add = this.state.add || 0;
        this.setState( {add: ++add} );
    }


    render() {
        var dressedChildren = React.Children.map( this.props.children, _addProps.bind( this ) );
        return (
            <div className={css.dbWrap}>
                {dressedChildren}
                <div className={css.dbMsg}>{this.state.msg}</div>
                <div className={css.cardWrap}>
                    <ListWrap
                        aData={this.state.aData}
                        delContent={this.delContent.bind(this)}
                        useContent={this.useContent.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

DBList.defaultProps = {
    keyPath: 'id',
    storeName: 'foo'
};
DBList.propTypes = {
    keyPath: React.PropTypes.string.isRequired,
    storeName: React.PropTypes.string.isRequired
};

function _addProps( child ) {
    return React.cloneElement( child, {
        handler: {
            commitContent: this.commitContent.bind( this ),
            newOne: this.newOne.bind( this )
        }
    } )
}


