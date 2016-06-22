import React from 'react';

import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import Subheader from "material-ui/Subheader";
import TextField from 'material-ui/TextField';


import css from "./css.scss";

export class Log extends React.Component {
    constructor( props ) {
        super( props );
        this.state={
            info:[],
            ip:'',
            defIp:''
        }
    }
    componentDidMount(){
        this.props.ws.onmessage = data=>{
            let pdata = JSON.parse( data.data );
            if(pdata._conf_){

                //接收push来的本机ip
                if(pdata._conf_.ip){
                    var state={};
                    //本地有,就只存到defIp,
                    if(!localStorage.remoteIP){
                        state.ip = pdata._conf_.ip;
                    }
                    state.defIp = pdata._conf_.ip;

                    this.setState( state )
                }


            }else{
                let url = pdata.request.url;
                let id = pdata.id;
                this.setState( {
                    info: [{id, url}, ...this.state.info]
                } );
                this.reqID( id );
            }

        };

        //get localStorage data
        if(localStorage.remoteIP){
            this.setState( {
                ip: localStorage.remoteIP
            } );
            this.props.ws.onopen=()=> this.sendIpTarget( localStorage.remoteIP );

        }
    }
    sendIpTarget(ip){
        this.props.ws.send( JSON.stringify( {
            _conf_: {ip}
        } ) )
        console.log('send cur-ip:'+ip)
    }
    reqID(id){
        this.props.reqID( id );
    }

    ipChange(e){
        this.setState({ip: e.target.value})
    }

    ipTextBlur(e){
        let val= e.target.value;
        if(!val){
            this.setState( {ip: this.state.defIp} )
        }
        //如果是默认那个,就不写localstroage, 因为用户下次登入网络后ip可能变了, 但用户不知道自己设置了ip
        if(val!==this.state.defIp){
            localStorage.setItem( "remoteIP", val );
        }else{
            localStorage.setItem( "remoteIP", "" );
        }
        this.sendIpTarget( val);


    }
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <Subheader>请求Log</Subheader>

                    <TextField
                        hintText={<p className={css.textIpHint}>开发前端项目的设备的IP地址(默认是当前打开这个后台页面的设备IP)</p>}
                        floatingLabelText="筛选请求的设备IP"
                        fullWidth={true}
                        value={this.state.ip}
                        onChange={this.ipChange.bind(this)}
                        onBlur={this.ipTextBlur.bind(this)}
                        className={css.textIp}
                    />

                    {
                    this.state.info.map(item=> {
                        return (
                            <Paper key={item.id} zDepth={1} className={css.item} onClick={this.reqID.bind(this,item.id)}>
                                <p className={css.id} title="使用这个ID">请求ID:{item.id}</p>
                                <p className={css.line}>请求URL:{item.url}</p>
                            </Paper>
                        )
                    })
                }
                </div>
            </MuiThemeProvider>
        );
    }
};