import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import genID from './gen-id';

export default class Add extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            errNeedDesc: '',
            desc: '',
            slug: ''
        };
    }

    save(){
        if (!this.state.desc) return this.setState( {errNeedDesc: '添加一个描述哇'} );
        this.props.handleSave({
            desc:this.state.desc,
            slug: this.state.slug,
            id: genID()
        });
        this.props.handleClose()
    }

    descChange( e ) {
        this.setState( {desc: e.target.value, errNeedDesc: null} );
    }

    slugChange( e ) {
        this.setState( {slug: e.target.value} );
    }

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="保存"
                primary={true}
                onTouchTap={this.save.bind(this)}
            />
        ];

        return (
            <div>
                <Dialog
                    title="只需再补全一些信息"
                    actions={actions}
                    modal={false}
                    open={this.props.open}
                    onRequestClose={this.props.handleClose}
                >
                    <TextField
                        hintText="这是什么样的数据?"
                        floatingLabelText="数据描述"
                        fullWidth={true}
                        value={this.state.desc}
                        onChange={this.descChange.bind(this)}
                        errorText={this.state.errNeedDesc}
                    />
                    <TextField
                        hintText="slug"
                        floatingLabelText="数据slug"
                        fullWidth={true}
                        value={this.state.slug}
                        onChange={this.slugChange.bind(this)}
                    />
                </Dialog>
            </div>
        );
    }
}