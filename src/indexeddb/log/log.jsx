import React from 'react';

import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";

import css from "./css.scss";

export class Log extends React.Component {
    constructor( props ) {
        super( props );
        this.state={
            info:[]
        }
    }
    componentDidMount(){
        this.props.ws.onmessage = data=>{
            let pdata = JSON.parse( data.data );
            let url = pdata.request.url;
            let id = pdata.id;
            let request = JSON.stringify(pdata.request);
            this.setState({
                info:[{id, url,request},...this.state.info]
            });
            this.reqID(id);
        }
    }
    reqID(id){
        this.props.reqID( id );
    }
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <Subheader>请求Log</Subheader>

                    {
                    this.state.info.map(item=> {
                        return (
                            <Paper key={item.id} zDepth={1} className={css.item}>
                                <p className={css.id} onClick={this.reqID.bind(this,item.id)} title="使用这个ID">请求ID:{item.id}</p>
                                <p className={css.line} title={item.request}>请求URL:{item.url}</p>
                            </Paper>
                        )
                    })
                }
                </div>
            </MuiThemeProvider>
        );
    }
};
