import React from 'react';

import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import css from "./css.scss";

export class HandleBar extends React.Component {
    constructor( props ) {
        super( props );
    }
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div className={css.handleBar}>
                <RaisedButton label="新建API" onTouchTap={this.props.handler.newOne} primary={true} />
                </div>
            </MuiThemeProvider>
        );
    }
}