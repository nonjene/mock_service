import React from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import {Tabs, Tab} from "material-ui/Tabs";
import SwipeableViews from "react-swipeable-views";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "../lib/css/normalize.scss";
import {DBList} from "./db-list.jsx";
import {ApiList} from "./auto-res/api-list.jsx";
import {Left} from "./left/left.jsx";
import {Log} from "./log/log.jsx";
// From https://github.com/oliviertassinari/react-swipeable-views
injectTapEventPlugin();

//tab style
const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400
    },
    slide: {
        padding: 10
    }
};
var ws = new WebSocket( 'ws://' + window.location.hostname + ":3336" );
var ws2 = new WebSocket( 'ws://' + window.location.hostname + ":3336" );

export class App extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            id:  '',
            ws: ws,
            addData:{},
            instantUseData:{},
            tabIndex:0,
            dataList:[] //嗯, 数据在db-list组件里面获取的。。。忍住别笑

        }
    }
    componentDidMount(){
        
    }
    doForceUpdate(){
        this.forceUpdate()
    }
    reqID(id){
        this.setState({
            id:id
        })
    }
    add(data){
        this.setState( {
            addData: data
        } )
    }

    instantUse(data){
        this.setState( {
            instantUseData: data
        } )
    }

    tabChange( value ){
        this.setState( {
            tabIndex: value
        } );
    };

    dataListUpdated( dataList){
        this.setState({
            dataList
        })
    }
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>

                <div>
                    <Tabs
                        onChange={this.tabChange.bind(this)}
                        value={this.state.tabIndex}
                    >
                        <Tab label="主面板" value={0} route="/home"/>
                        <Tab label="自动匹配" value={1} route="/second"/>
                    </Tabs>
                    <SwipeableViews index={this.state.tabIndex} onChangeIndex={this.tabChange.bind(this)} className='slide-root' >
                        <div style={styles.slide}>
                            <div id="flex-container">
                                <div className="raw-item">
                                    <Left
                                        id={this.state.id}
                                        ws={this.state.ws}
                                        add={this.add.bind(this)}
                                        instantUseData={this.state.instantUseData}
                                    />

                                </div>
                                <div className="raw-item">
                                    <DBList onRender={this.doForceUpdate.bind(this)}
                                        onUpdateData={this.dataListUpdated.bind(this)}
                                        storeName="LizhiMockAPI13" keyPath="id" instantUse={this.instantUse.bind(this)} addData={this.state.addData} />
                                </div>
                                <div className="raw-item">
                                    <Log
                                        ws={this.state.ws}
                                        reqID={this.reqID.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={styles.slide}>
                            <ApiList
                                storeName="LizhiMockAPI100"
                                keyPath="id"
                                dataList={this.state.dataList}
                                socket={ws2}
                                need
                            />
                        </div>

                    </SwipeableViews>
                </div>
            </MuiThemeProvider>
        )
    }

}
   