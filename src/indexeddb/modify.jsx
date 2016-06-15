import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import css from "./db-list.scss";

var newEditor = function(){
    this.editor = new JSONEditor( this.refs.editor, {
        mode: "tree",
        search: false,
        sortObjectKeys: false,
        modes: ["tree", "code"]
    } );
    this.editor.set( this.state.body );
};

export default class Modify extends React.Component {
    constructor( props ) {
        super( props );
        var {desc,slug,body,...rest} = this.props.data;
        this.state = {
            errNeedDesc: '',
            desc: desc,
            slug: slug,
            body:body,
            rest: rest
        };
    }

    componentDidMount() {
    }
    componentDidUpdate(preProps){
        if(preProps.open===false && this.props.open===true){
           setTimeout(()=>{
               newEditor.call( this );
               this.forceUpdate()

           },0)
        }
    }

    save() {
        if (!this.state.desc) return this.setState( {errNeedDesc: '添加一个描述哇'} );
        // console.log( this.props.data)
        // console.log( this.state.rest)
        var newBody = this.editor.get();
        this.props.handleSave( {
            desc: this.state.desc,
            slug: this.state.slug,
            body: newBody,
            ...this.state.rest
        } );
        this.setState({body: newBody})
        this.props.handleClose()
    }

    descChange( e ) {
        this.setState( {desc: e.target.value, errNeedDesc: null} );
    }

    slugChange( e ) {
        this.setState( {slug: e.target.value} );
    }
    close(){
        this.editor = null;
        this.props.handleClose();
    }
    /**
     * {}
     * @returns {XML}
     */

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.close.bind(this)}
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
                    title="修改"
                    actions={actions}
                    modal={false}
                    open={this.props.open}
                    onRequestClose={this.close.bind(this)}
                >
                    <div className={css.diaModEdit} ref="editor"></div>
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