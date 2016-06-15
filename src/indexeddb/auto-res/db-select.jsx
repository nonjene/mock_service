import React from 'react';

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import DBHandler from "../db-handler";


export default class DBSelect extends React.Component {
    constructor( props ) {
        super( props );
    }
//dataList
    list(){
        return this.props.dataList.map(item=>{
            return (
                <MenuItem key={item.id} value={item.id} primaryText={item.desc} />
            )
        })
    }


    render() {
        return (
            <SelectField value={this.props.target_id} onChange={this.props.targetChange}>
                {this.list()}
            </SelectField>
        );
    }
}