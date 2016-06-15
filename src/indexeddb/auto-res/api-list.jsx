import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import DebounceInput from "react-debounce-input";
import RaisedButton from "material-ui/RaisedButton";
import {grey400} from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import DBHandler from "../db-handler";
import genID from "../gen-id";
import WSRes from "./ws-res";
import DBSelect from "./db-select.jsx";
import css from "./api-list.scss";

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltipPosition="bottom-left"
    >
        <MoreVertIcon color={grey400} />
    </IconButton>
);
const SampleData = {
    id: '123123',
    addr: 'xxx/yyy',
    target_id: '123456789'
};
function genEmptyData() {
    return {
        id: genID(),
        addr: '',
        target_id: ''
    }
}

export class ApiList extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            list: [],//api列表
            msg: '',
            dataDb:[]//数据列表
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

    componentDidMount() {
        this.db = new DBHandler( {
            storeName: this.props.storeName,
            keyPath: this.props.keyPath,
            openStore: 'instant',
            initStoreData: SampleData
        } );
        this.db.promiseOpenStore
            .then( db=>db.readAll() )
            .then( list=> {
                this.setState( {
                    list: list
                } )
            } );
        var dbData = new DBHandler( {
            storeName: this.props.dataStore,
            keyPath: this.props.datakeyPath,
            openStore: 'instant',
            initStoreData: {id: 1}
        } );
        dbData.promiseOpenStore
            .then( db=>db.readAll() )
            .then( list=> {
                this.setState( {
                    dataDb: list
                } )
            } );
        new WSRes({
            dbApi: this.db,
            dbData:dbData,
            webSocket:this.props.socket
        })
    }

    updData( id, prop ) {
        var newData = {};
        this.setState( {
            list: this.state.list.map( item=> {
                if (item.id === id) {
                    item = Object.assign( item, prop );
                    newData = item;
                }
                return item
            } )
        } );
        this.db.promiseOpenStore
            .then( db=>db.writeOne( id, newData ) );

    }

    createData() {
        var newData = genEmptyData();
        var newList = this.state.list.slice();
        newList.unshift( newData );
        this.setState( {list: newList} );
        this.db.promiseOpenStore
            .then( db=>db.writeOne( newData.id, newData ) );
    }

    deleteData(id){
        this.setState( {list: this.state.list.filter( item=>item.id !== id )} );
        this.db.promiseOpenStore
            .then( db=>db.removeData( id ) );

    }
    targetChange( id, e, index, target_id ) {
        this.updData( id, {target_id: target_id} )
    }

    nameChange( id, e ) {
        this.updData( id, {addr: e.target.value} )
    }

    renderList() {
        return this.state.list.map( item=> {
            return (
                <Paper key={item.id}
                    className={css.card}
                    zDepth={1}
                >

                    <DebounceInput element={TextField}
                        hintText="/sample/api"
                        floatingLabelText="接口地址"
                        fullWidth={true}
                        value={item.addr}
                        onChange={this.nameChange.bind(this,item.id)}
                        errorText={this.state.errNeedName}
                        debounceTimeout={450}
                    />

                    <DBSelect
                        targetChange={this.targetChange.bind(this,item.id)}
                        target_id={item.target_id}
                        dataList={this.state.dataDb}
                    />
                    <div className={css.paperHandler}>
                        <IconMenu iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={this.deleteData.bind(this,item.id)}>删除</MenuItem>
                        </IconMenu>
                    </div>
                </Paper>
            )
        } );
    }

    render() {
        return (

            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <Subheader>自动匹配api地址返回数据:</Subheader>
                    <RaisedButton className={css.addBtn} label="新建API" onTouchTap={this.createData.bind(this)} primary={true} />
                    <div className={css.cardWrap}>
                        {this.renderList.call( this )}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}