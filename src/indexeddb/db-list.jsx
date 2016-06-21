import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DBHandler from "./db-handler";
import ListWrap from "./list.jsx";
import Add from "./add.jsx";
import css from "./db-list.scss";


const SampleData = {
    "id": "111",
    "desc": "描述",
    "slug": "string",
    "body": {rcode: 0, msg: "success", data: []}
};


export class DBList extends React.Component {
    constructor( props ) {
        super( props );
        var _this = this;
        this.state = {
            aData: [],
            msg: '',
            showAddDia: false,
            showModifyDia: false,
            addData: {},
            modifyData: {}
        };
        this.addHandle = {
            open: function () {
                _this.setState( {showAddDia: true} )
            },
            close: function () {
                _this.setState( {showAddDia: false} )
            },
            save: function ( obj ) {
                obj.body = _this.state.addData;
                _this.commitContent( null, obj )
            }

        };
        
    }

    componentDidMount() {
        this.db = new DBHandler( {
            storeName: this.props.storeName,
            keyPath: this.props.keyPath,
            openStore: 'instant',
            initStoreData: SampleData
        } );
        this.getList( aData=>{
            this.setState( {aData: aData} );
            this.props.onRender();
        } );

    }
    componentDidUpdate(preprop, preState){
        if(preprop.addData!==this.props.addData && Object.keys( this.props.addData ).length > 0){
            this.setState( {
                showAddDia: true,
                addData: this.props.addData
            } )
        }
        if(this.state.aData!== preState.aData){
            this.props.onUpdateData( this.state.aData);
        }

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
            .then( thisDB=>thisDB.writeOne( o.id, o ) )
            .then( ()=>this.getList( aData=>this.setState( {aData: aData} ) ) )
            .then( ()=>this.setMsg( '保存成功~' ) )

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
        this.props.instantUse( content.body )
    }
    modContent( content ) {
        this.commitContent( null, content )
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
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div className={css.dbWrap}>
                    {dressedChildren}
                    <div className={css.cardWrap}>
                        <ListWrap
                            aData={this.state.aData}
                            delContent={this.delContent.bind(this)}
                            useContent={this.useContent.bind(this)}
                            modContent={this.modContent.bind(this)}
                        />
                    </div>
                    <div className={css.dbMsg}>{this.state.msg}</div>

                    <Add open={this.state.showAddDia}
                        handleClose={this.addHandle.close}
                        handleSave={this.addHandle.save}
                    />
                    
                </div>
            </MuiThemeProvider>
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


