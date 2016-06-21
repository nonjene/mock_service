import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import Subheader from "material-ui/Subheader";


export class Left extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            id: this.props.id || '',
            errNeedDesc: ''
        }
    }

    componentDidMount() {
        var options = {
            mode: "tree",
            search: false,
            sortObjectKeys: false,
            modes: ["tree", "code"]
        };
        setTimeout( ()=> {
            this.editor = new JSONEditor( this.refs.jsoneditor, options );

        }, 0 )
    }

    componentDidUpdate( preprop ) {
        var {instantUseData} = this.props;
        if (preprop.instantUseData !== instantUseData && Object.keys( instantUseData ).length > 0) {
            this.editor.set( instantUseData )
        }

        //更新id
        if(preprop.id !== this.props.id){
            this.setState({
                id: this.props.id
            })
        }

    }

    idChange( e ) {
        this.setState( {id: e.target.value, errNeedDesc: ''} );
    }

    send() {
        var data = {};
        data.id = this.state.id;
        data.body = this.editor.get();
        this.props.ws.send( JSON.stringify( data ) );
    }

    add() {
        var body = this.editor.get();
        this.props.add( body );
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <Subheader>手工返回数据:</Subheader>
                    <TextField
                        hintText="id"
                        floatingLabelText="回应ID"
                        fullWidth={false}
                        value={this.state.id}
                        onChange={this.idChange.bind(this)}
                        errorText={this.state.errNeedDesc}
                    />
                    <div style={{marginTop:'15px',marginBottom:'15px'}}>
                        <RaisedButton label="发送" onTouchTap={this.send.bind(this)} style={{marginRight:'15px'}} />
                        <RaisedButton label="新增到数据列表" onTouchTap={this.add.bind(this)} />

                    </div>

                    <div ref="jsoneditor" style={{"width": "400px", "height": "400px"}}></div>

                </div>

            </MuiThemeProvider>

        );
    }
}