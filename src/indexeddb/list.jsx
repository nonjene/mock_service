import React from "react";
import {List, ListItem} from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import {grey400} from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import Modify from "./modify.jsx";
import genID from "./gen-id";


const iconButtonElement = (
    <IconButton
        touch={true}
        tooltipPosition="bottom-left"
    >
    <MoreVertIcon color={grey400} />
    </IconButton>
);

export class Item extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            id:this.props.content.id|| genID(),
            showModifyDia:false
        };
        var _this = this;
        this.modifyHandle = {
            open: function () {
                _this.setState( {showModifyDia: true } )
            },
            close: function () {
                _this.setState( {showModifyDia: false} )
            },
            save: function (newData) {
                _this.props.modContent( newData );
            }

        }
    }

    delContent() {
        this.props.delContent( this.state.id );
    }

    modContent() {
        return this.modifyHandle.open();
    }

    useContent() {
        this.props.useContent( this.state.id, this.props.content );
    }

    render() {
        return (
            <div onTouchTap={this.useContent.bind(this)}>
                <ListItem
                    rightIconButton={
                    <IconMenu iconButtonElement={iconButtonElement}>
                        <MenuItem onTouchTap={this.useContent.bind(this)}>使用</MenuItem>
                        <MenuItem onTouchTap={this.modContent.bind(this)}>修改</MenuItem>
                        <MenuItem onTouchTap={this.delContent.bind(this)}>删除</MenuItem>
                    </IconMenu>
                    }
                    primaryText={this.props.content.desc}
                    secondaryText={this.props.content.slug}
                />
                < Divider />
                <Modify open={this.state.showModifyDia}
                    data={this.props.content}
                    handleClose={this.modifyHandle.close}
                    handleSave={this.modifyHandle.save}
                />
            </div>
        );
    }
}
export class ListWrap extends React.Component {
    constructor( props ) {
        super( props );

    }
    renderList() {
        var render = this.props.aData.map( oriItem=> {
            return <Item
                content={oriItem}
                key={oriItem.id}
                delContent={this.props.delContent}
                useContent={this.props.useContent}
                modContent={this.props.modContent}
            />
        } );

        return render;

    }

    render() {
        return (
                <List>
                    <Subheader>数据列表</Subheader>
                    {this.renderList()}

                </List>
        );
    }
}

export default ListWrap;