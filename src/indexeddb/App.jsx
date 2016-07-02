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
import {initWs} from '../lib/ws';
// From https://github.com/oliviertassinari/react-swipeable-views
injectTapEventPlugin();

const ws = initWs();

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

export class App extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            id:  '',
            addData:{},
            instantUseData:{},
            tabIndex: this.props.route || 0,
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
        try{
            this.props.routeChange(value)
        }catch(e){}
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
                        <Tab label="主面板" value={0}/>
                        <Tab label="自动匹配" value={1}/>
                    </Tabs>
                    <SwipeableViews index={this.state.tabIndex} onChangeIndex={this.tabChange.bind(this)} className='slide-root' >
                        <div style={styles.slide}>
                            <div id="flex-container">
                                <div className="raw-item">
                                    <Left
                                        id={this.state.id}
                                        ws={ws}
                                        add={this.add.bind(this)}
                                        instantUseData={this.state.instantUseData}
                                    />

                                </div>
                                <div className="raw-item">
                                    <DBList onRender={this.doForceUpdate.bind(this)}
                                        onUpdateData={this.dataListUpdated.bind(this)}
                                        storeName="MockService002" keyPath="id" instantUse={this.instantUse.bind(this)} addData={this.state.addData} />
                                </div>
                                <div className="raw-item">
                                    <Log
                                        ws={ws}
                                        reqID={this.reqID.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={styles.slide}>
                            <ApiList
                                storeName="MockService100"
                                keyPath="id"
                                dataList={this.state.dataList}
                                socket={ws}
                                need
                            />
                        </div>

                    </SwipeableViews>
                </div>
            </MuiThemeProvider>
        )
    }

}
   