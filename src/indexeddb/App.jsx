import React from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import "../lib/css/normalize.scss";
import css from "./css.scss";
import {DBList} from "./db-list.jsx";
import {ApiList} from "./auto-res/api-list.jsx";
import {Left} from "./left/left.jsx";
import {Log} from "./log/log.jsx";
injectTapEventPlugin();

var ws = new WebSocket( 'ws://' + window.location.hostname + ":3336" );

export class App extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            id:  '',
            ws: ws,
            addData:{},
            instantUseData:{}

        }
    }
    componentDidMount(){
        
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

    render() {
        return (
            <div className={css.wrap}>
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
                        <DBList storeName="LizhiMockAPI13" keyPath="id" instantUse={this.instantUse.bind(this)} addData={this.state.addData}/>

                    </div>
                    <div className="raw-item">
                        <Log
                            ws={this.state.ws}
                            reqID={this.reqID.bind(this)}
                        />
                    </div>
                </div>
                <div className="second-floor" id="auto_res_list">
                    <ApiList
                        storeName="LizhiMockAPI100"
                        keyPath="id"
                        dataStore="LizhiMockAPI13"
                        datakeyPath="id"
                        socket={new WebSocket('ws://' + window.location.hostname + ":3336")}
                    />
                </div>


            </div>
        )
    }

}
   