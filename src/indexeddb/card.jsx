import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import TextField from 'material-ui/TextField';

import css from "./css.scss";

//import {PrismEditor} from './editor.jsx';
const Rcolon = /:/g;
const Rparantheses = /\{/g;
const Rparantheses2 = /\}/g;
const Rdot = /,/g;
const Sspace = '    ';

//todo: 找个格式化json的库
function formatJSONString( cont ) {
    if(!cont){ return cont}
    return cont
        .replace( Rparantheses,'{\n'+ Sspace)
        .replace( Rparantheses2,'\n}')
        .replace( Rdot,',\n'+ Sspace)
        .replace( Rcolon, ': ' );
}

export class CardPiece extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            /*editorHandle: {
                getContent: false
            },*/
            text: formatJSONString( this.props.content || '' ),
            name: this.props.name||'',
            errNeedName:null
        }
    }

    componentDidMount(){
        var options = {
            mode: "tree",
            search: false,
            sortObjectKeys: false,
            modes: ["tree", "code"]
        };
        this.editor = new JSONEditor( this.refs.editor, options );
        if(this.props.content){
            this.editor.set( JSON.parse(this.props.content))
        }
    }
    getContentFromEditor(){
        var o = this.editor.get();
        if(o.choose){
            return o[o.choose]
        }else{
            return o;
        }
    }

    willGetContent() {
        /*this.setState( {
         editorHandle: {getContent: true}
         } );*/
        if(!this.state.name) return this.setState({errNeedName:'请填写接口名'});
        this.props.commitContent( this.state.name, this.getContentFromEditor() );
    }

    willDelContent(){
        this.props.delContent( this.state.name );
    }

    willUseContent(){
        if (!this.state.name) return this.setState( {errNeedName: '请填写接口名'} );
        this.props.useContent( this.state.name, this.getContentFromEditor() );
    }
   /*didGetContent( str ) {
        this.setState( {
            editorHandle: {getContent: false}
        } );
        console.log( str )
    }*/

    nameChange( e ) {
        this.setState( {name: e.target.value, errNeedName: null} );
    }

    textChange( e ) {
        this.setState( {text: e.target.value} );
    }

    /**
     ---1---
     <Editor
     editorState={this.state.editorState}
     handleKeyCommand={this.handleKeyCommand}
     onChange={this.onChange}
     placeHolder='JSON Data...'
     />
     ---2---
     <PrismEditor handle={this.state.editorHandle} getContent={this.didGetContent.bind(this)}/>
     <label>接口地址:<input value={this.state.name} onChange={this.nameChange.bind(this)} type="text" /></label>

     <textarea className={css.textarea} value={this.state.text} onChange={this.textChange.bind(this)} />

     * @returns {XML}
     */
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <Paper zDepth={2} className={css.editorPaper}>
                    <header>
                        <TextField
                            hintText="/sample/api"
                            floatingLabelText="接口地址"
                            fullWidth={true}
                            value={this.state.name}
                            onChange={this.nameChange.bind(this)}
                            errorText={this.state.errNeedName}
                        />
                    </header>
                    <div className={css.editorWrap} ref="editor">
                    </div>
                    <SaveButton
                        onSave={this.willGetContent.bind(this)}
                        onDel={this.willDelContent.bind(this)}
                        onUse={this.willUseContent.bind(this)}
                    />
                </Paper>
            </MuiThemeProvider>

        );
    }
}
CardPiece.defaultProps = {
    commitContent: function () {
        console.error( '请给CardPiece 添加prop: commitContent' )
    }
};

class SaveButton extends React.Component {
    render() {
        return (
            <footer>
                <RaisedButton label="使用" onTouchTap={this.props.onUse} className={css.cardBtn}/>
                <RaisedButton label="删除" onTouchTap={this.props.onDel} className={css.cardBtn}/>
                <RaisedButton label="保存" onTouchTap={this.props.onSave} className={css.cardBtn} />
            </footer>
        )
    }
}